import { useEffect, useState, useRef } from "react";
import Addons from "../components/Events/AddonsPurchase";
import Summary from "../components/Events/SummaryFromAddons";
import Pay from "../components/Events/Pay";
import { fetchClient } from "../AxiosConfig";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import Popup from "../components/Popup";
import moment from "moment";

export default function PurchaseFromTicket() {
  const Ref = useRef(null);

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
      setAddonList(tempList);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
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
  }, [addonList]);

  useEffect(() => {
    if (step === 2) clearTimer(getDeadTime());
    else {
      setPercent(100);
      setTimer("15:00");
    }
  },[step])

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
    const baseDate = new Date("2024-11-22"); // Base date: 22 Nov 2024
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
          event_date: ["2024-11-22", "2024-11-23", "2024-11-24"], // Set to null if no selectedDates
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
