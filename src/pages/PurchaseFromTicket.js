import { useEffect, useState, useRef } from "react";
import Addons from "../components/Events/AddonsPurchase";
import Summary from "../components/Events/SummaryFromAddons";
import Pay from "../components/Events/Pay";
import { fetchClient } from "../AxiosConfig";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import Popup from "../components/Popup";
import moment from "moment";
import axios from "axios";

export default function PurchaseFromTicket() {
  const Ref = useRef(null);
  const hasRestoredRef = useRef(false);

  const [step, setStep] = useState(0);
  const [addonList, setAddonList] = useState([]);
  const [addonFilter, setAddonFilter] = useState("All");
  const [filters, setFilters] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [dateList, setDateList] = useState([]);
  const [payAmount, setPayAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState({
    success: false,
    show: false,
  });
  const [percent, setPercent] = useState(100);
  const [timer, setTimer] = useState("15:00");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [closeToStep0, setCloseToStep0] = useState(false);
  const [purchaseData, setPurchaseData] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const packageData = await fetchClient(
        "",
        "GET",
        `?action=packageDetails&url_slug=GeneralAdmissionDayPass-631278`
      );

      if (packageData) {
        const convertDate = packageData.data.event_dates?.map((dd, idx) => {
          const selected = dateList.find((date) => date.value === dd);
          return {
            id: idx,
            title: moment(dd, "YYYY-MM-DD").format("LLLL"),
            value: dd,
            selected: selected ? selected.selected : false,
          };
        });
        setDateList(convertDate || []);
      }

      // Fetch addon inventory
      const addonData = await fetchClient(
        "",
        "GET",
        `?action=allAddonsInventory`
      );

      const tempList = addonData.data.map((inventory) => {
        const selected = addonList.find((add) => add.id === inventory.id);
        return {
          ...inventory,
          qty: selected ? selected.qty : 0,
          selected: selected ? selected.selected : false,
          selectedDates: [],
        };
      });

      // Check if there's pending summary data (only restore once)
      const summaryDataStr = localStorage.getItem("pendingSummaryData");
      console.log("🔍 Checking for pendingSummaryData:", summaryDataStr ? "FOUND" : "NOT FOUND");
      console.log("🔒 hasRestoredRef.current:", hasRestoredRef.current);

      if (summaryDataStr && !hasRestoredRef.current) {
        try {
          const summaryData = JSON.parse(summaryDataStr);
          console.log("✅ Parsed summary data:", summaryData);

          // Check if data is fresh (< 30 minutes)
          const thirtyMinutes = 30 * 60 * 1000;
          const age = Date.now() - summaryData.timestamp;
          console.log(`⏱️ Data age: ${Math.floor(age / 1000)} seconds (max: ${thirtyMinutes / 1000} seconds)`);

          if (Date.now() - summaryData.timestamp < thirtyMinutes) {
            console.log("✅ Data is fresh, restoring...");

            // Restore the summary data by merging with fresh inventory
            const restoredList = tempList.map(inventory => {
              const savedAddon = summaryData.selectedAddons.find(s => s.id === inventory.id);
              if (savedAddon) {
                return {
                  ...inventory,
                  qty: savedAddon.qty,
                  selected: true,
                  selectedDates: savedAddon.selectedDates
                };
              }
              return inventory;
            });

            // Calculate payAmount SYNCHRONOUSLY before setting state
            let total = 0;
            restoredList.forEach((addon) => {
              if (addon.qty > 0) {
                const dateCount = addon.selectedDates && addon.selectedDates.length > 0
                  ? addon.selectedDates.length
                  : 1;
                const addonTotal = addon.price * addon.qty * dateCount;
                total += addonTotal;
              }
            });

            console.log("📊 Restored addonList:", restoredList);
            console.log("💰 Calculated total:", total);

            // Mark as restored to prevent double execution
            hasRestoredRef.current = true;

            // Set both addonList and payAmount together
            setIsRestoring(true);
            setAddonList(restoredList);
            setPayAmount(total);

            // Use setTimeout to defer step transition until after state updates complete
            setTimeout(() => {
              console.log("🎯 Setting step to 1");
              setStep(1);
              setIsRestoring(false); // Reset flag
              // DON'T remove localStorage here - moved to separate useEffect
            }, 0);

            setLoading(false);
            return;
          } else {
            console.log("❌ Data expired, clearing...");
            localStorage.removeItem("pendingSummaryData"); // Expired
          }
        } catch (e) {
          console.error("❌ Error restoring summary data:", e);
          localStorage.removeItem("pendingSummaryData");
        }
      } else {
        console.log("ℹ️ No pending summary data found or already restored, normal flow");
      }

      // Normal flow - only if not restored
      if (!hasRestoredRef.current) {
        setAddonList(tempList);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Skip if we're restoring from localStorage
    if (isRestoring) {
      return;
    }

    let total = 0;
    if (addonList.length) {
      // Calculate addon total
      addonList.forEach((addon) => {
        if (addon.qty > 0) {
          const dateCount =
            addon.selectedDates && addon.selectedDates.length > 0
              ? addon.selectedDates.length
              : 1; // If no selectedDates, consider only qty
          const addonTotal = addon.price * addon.qty * dateCount;
          total += addonTotal;
        }
      });

      // Set total to the pay amount
      setPayAmount(total);
    }
  }, [addonList, isRestoring]);

  // Clean up localStorage when Summary page is confirmed rendered
  useEffect(() => {
    if (step === 1 && hasRestoredRef.current) {
      console.log("✅ Summary page rendered, safe to clear localStorage");
      localStorage.removeItem("pendingSummaryData");
      hasRestoredRef.current = false; // Reset for future use
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) clearTimer(getDeadTime());
    else {
      setPercent(100);
      setTimer("15:00");
    }
  },[step])

  const transformData = (data) => {
    const filters = ["All", ...data.map((item) => item.Tag)];
    const subCategories = data.reduce((acc, item) => {
      acc[item.Tag] = item.subTags;
      return acc;
    }, {});

    return { filters, subCategories };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/?action=tagsList`
        );
        if (data) {
          const { filters, subCategories } = transformData(data.data);
          setFilters(filters);
          setSubCategories(subCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePreviousStep = () => {
    if (step === 0) navigate(-1);
    if (step === 1) setStep(0);
  };

  const handleNextStep = () => {
    if (step === 0 && payAmount > 0) {
      setStep(1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Helper function to format the date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }); // Returns formatted date like "22 Nov"
  };

  // Helper function to calculate "Day 1", "Day 2", etc.
  const calculateDay = (dateStr) => {
    const baseDate = new Date("2025-11-21"); // Base date: 21 Nov 2024 (Day 1)
    const selectedDate = new Date(dateStr);

    // Calculate the difference in days from the base date
    const dayDifference =
      Math.floor((selectedDate - baseDate) / (1000 * 60 * 60 * 24)) + 1;

    return `Day ${dayDifference}`;
  };

  const closePopup = () => {
    setCloseToStep0(false);
    setTimer("15:00");
    setPercent(98.8);
    setPopupOpen(false);
    setPayAmount(0);
    setCoupon("");
    setCouponApplied({ success: false, show: false });
    setStep(0);
  };

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("15:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 900);
    return deadline;
  };

  const generatePurchaseNumber = () => {
    const permittedChars = '123456789abcdefghijklmnopqrstuvwxyz';
    const randomString = Array.from({ length: 7 }, () => 
      permittedChars.charAt(Math.floor(Math.random() * permittedChars.length))
    ).join('');
    
    return `H${randomString.toUpperCase()}`;
  };

  const handlePay = async () => {
    // Check if user is authenticated
    if (!localStorage.getItem("uuid")) {
      // Save summary data - only selected addons
      const summaryData = {
        payAmount: payAmount,
        selectedAddons: addonList.filter(addon => addon.qty > 0).map(addon => ({
          id: addon.id,
          name: addon.name,
          price: addon.price,
          qty: addon.qty,
          selectedDates: addon.selectedDates
        })),
        timestamp: Date.now()
      };
      localStorage.setItem("pendingSummaryData", JSON.stringify(summaryData));
      localStorage.setItem("redirectAfterLogin", "/addons");
      navigate("/signin");
      return;
    }

    let payload = {addons : addonList
    .filter((addon) => addon.qty > 0) // Filter addons with quantity greater than 0
    .flatMap((addon) => {
      // Check if selectedDates exists and is non-empty
      if (addon.selectedDates && addon.selectedDates.length > 0) {
        return addon.selectedDates.map((selectedDate) => {
          return {
            id: addon.id,
            qty: addon.qty,
            price: addon.price, // Assuming you have the price here
            time_slot_id: selectedDate.time_slot_id, // Use the time_slot_id from selectedDates
            event_date: selectedDate.date, // Use the date from selectedDates
          };
        });
      } else {
        // If no selectedDates, return addon with null for time_slot_id and event_date
        return {
          id: addon.id,
          qty: addon.qty,
          price: addon.price, // Assuming you have the price here
          time_slot_id: null, // Set to null if no selectedDates
          event_date: ["2025-11-21", "2025-11-22", "2025-11-23"], // Set to null if no selectedDates
        };
      }
    })
  }

    const formData = new FormData();
    formData.append("action", "purchaseAddons");
    formData.append("purchase_number", generatePurchaseNumber());
    formData.append("items", JSON.stringify(payload));
    const data = await fetchClient(formData, "POST", "");
    if (data.purchase_number) {
      setPurchaseData(data);
      setStep(2);
      // Clean up pending summary data after successful purchase
      localStorage.removeItem("pendingSummaryData");
    }
  };

  const handleClosePay = () => {
    setCoupon("");
    setCouponApplied({ success: false, show: false });
    setCloseToStep0(true);
  };

  return (
    <div>
      {step === 0 && !loading && (
        <Addons
          addonList={addonList}
          setAddonList={setAddonList}
          addonFilter={addonFilter}
          setAddonFilter={setAddonFilter}
          filters={filters}
          subCategories={subCategories}
          dates={dateList}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          loading={loading}
          payAmount={payAmount}
        />
      )}
      {step === 1 && (
        <Summary
          payAmount={payAmount}
          handleNextStep={handlePay}
          addonList={addonList}
          orderData={{
            addonInfo: addonList
              .filter((add) => add.qty > 0)
              .map((addon) => {
                const selectedDateTime = addon.selectedDates || [];
                const dateCount = addon.selectedDates?.length
                  ? addon.selectedDates.length
                  : 1;
                return {
                  name: addon.name,
                  "Unit price": `${addon.price} AED`,
                  Quantity: addon.qty,
                  "date&time": selectedDateTime
                    .map((slot) => {
                      const formattedDate = `${calculateDay(
                        slot.date
                      )} - ${formatDate(slot.date)}${
                        slot.timeSlot ? ` - ${slot.timeSlot}` : ""
                      }`;

                      // Only return a div if formattedDate is not empty
                      return formattedDate.trim() !== "" ? (
                        <div key={slot.date}>
                          {" "}
                          {/* Use a unique key, such as slot.date */}
                          {formattedDate}
                        </div>
                      ) : null;
                    })
                    .filter((entry) => entry !== null), // Filter out null entries
                  Price: `${addon.price * addon.qty * dateCount} AED`,
                };
              }),
          }}
          handlePreviousStep={handlePreviousStep}
          timer={timer}
          percent={percent}
          isPopupOpen={isPopupOpen}
          closePopup={closePopup}
          couponApplied={couponApplied}
          loading={loading}
          setCloseToStep0={setCloseToStep0}
        />
      )}
      {step === 2 && (
        <Pay
          handlePreviousStep={handlePreviousStep}
          // handleNextStep={handleNextStep}
          // handlePay={handlePay}
          payAmount={payAmount}
          purchaseData={purchaseData}
          setPayAmount={setPayAmount}
          setStep={setStep}
          timer={timer}
          percent={percent}
          isPopupOpen={isPopupOpen}
          closePopup={closePopup}
          loading={loading}
          handleClosePay={handleClosePay}
        />
      )}
      <Popup isOpen={closeToStep0} width="w-[90vw] sm:w-[50vw]">
        <h2 className="text-xl font-bold mb-2 text-center">Cancel purchase</h2>
        <p className="text-center m-3">Are you sure?</p>
        <div className="flex gap-0 sm:gap-2 justify-center flex-col  ">
          <div
            onClick={() => setCloseToStep0(false)}
            className="w-full text-center  flex flex-col justify-between items-center text-white bg-[#c06f39] px-[1rem] py-[1rem] cursor-pointer mt-2"
          >
            Continue
          </div>
          <div
            onClick={closePopup}
            className="w-full text-center  flex flex-col justify-between items-center text-white bg-[#c06f39] px-[1rem] py-[1rem] cursor-pointer mt-2"
          >
            Cancel booking
          </div>
        </div>
      </Popup>
    </div>
  );
}
