import { useEffect, useState, useRef } from "react";
import Tickets from "../components/Events/Tickets";
import DatePicker from "../components/Events/DatePicker";
import Addons from "../components/Events/Addons";
import Summary from "../components/Events/Summary";
import Pay from "../components/Events/Pay";
import { fetchClient } from "../AxiosConfig";
import { title } from "../constants/index";
import moment from "moment";
import Popup from "../components/Popup";
import { profileDetails } from "../ProfileApi";
import Logo from "../logo_dark.png";
import axios from "axios";

export default function Events() {
  const [step, setStep] = useState(0);
  const [ticketSlug, setTicketSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [enableDate, setEnableDate] = useState(false);
  const [enableAddons, setEnableAddons] = useState(false);
  const [qty, setQty] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [tempSelectedTicket, setTempSelectedTicket] = useState({});
  const [ticketList, setTicketList] = useState([]);
  const [tempTicketList, setTempTicketList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [inventoryList, setInventoryList] = useState();
  const [selectedAddon, setSelectedAddon] = useState();
  const [addonList, setAddonList] = useState([]);
  const [tempAddonList, setTempAddonList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [purchaseData, setPurchaseData] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [applePaymentUrl, setApplePaymentUrl] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState({
    success: false,
    show: false,
  });
  const [deductedValue, setDeductedValue] = useState(0);
  const [closeToStep0, setCloseToStep0] = useState(false);
  const [percent, setPercent] = useState(100);
  const [timer, setTimer] = useState("15:00");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [addonFilter, setAddonFilter] = useState("All");
  const [filters, setFilters] = useState([]);
  const [subCategories, setSubCategories] = useState({});

  const Ref = useRef(null);

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

  function convertMinutesToSeconds(time) {
    // Split the time string into minutes and seconds
    const [minutes, seconds] = time.split(":").map(Number);

    // Calculate the total seconds
    const totalSeconds = minutes * 60 + seconds;

    return totalSeconds;
  }

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

  useEffect(() => {
    if (step === 4) {
      const mins = 15;
      // start timer
      const stopIntervalCountdown = setInterval(() => {
        // for each second I want to reduce the percent length
        const newPercentage =
          (convertMinutesToSeconds(timer) / (15 * 60)) * 100;
        if (newPercentage > 0) {
          setPercent(newPercentage);
          // setPercent((currentTime) => {
          //   console.log(convertMinutesToSeconds(timer), currentTime);
          //   return currentTime - decrementValuePerSecond;
          // });
        } else {
          // redirect to back
          clearInterval(stopIntervalCountdown);
          clearTimeout(timeoutHandler);
          setPopupOpen(true);
        }
      }, 1000);

      const timeoutHandler = setTimeout(() => {
        clearInterval(stopIntervalCountdown);
        setPopupOpen(true);
      }, mins * 60 * 1000);

      return () => {
        clearTimeout(timeoutHandler);
        clearInterval(stopIntervalCountdown);
      };
    }
  }, [step, timer]);

  useEffect(() => {
    window.scroll({ behavior: "smooth", top: 0 });
    const getEventsList = async () => {
      setPackageLoading(true);
      const formData = new FormData();
      formData.append("action", "packages");
      const data = await fetchClient(formData, "POST", "");
      if (data) {
        const tempList = data.data.map((list) => {
          const selected = selectedTicket.id === list.id;
          return {
            ...list,
            qty: selected ? selectedTicket.qty : 0,
            showMore: selected ? selectedTicket.showMore : false,
          };
        });
        // setTicketList(
        //   selectedFilter === "All"
        //     ? tempList
        //     : tempList.filter((item) => item.tags.includes(selectedFilter))
        // );
        setTempTicketList(tempList);
        setPackageLoading(false);
      }
    };
    if (!step) getEventsList();
    if (step === 4) clearTimer(getDeadTime());
    else {
      setPercent(100);
      setTimer("15:00");
    }
  }, [step]);

  const handleNextStep = async () => {
    if (loading) {
      return;
    }
    var datePicker = false;
    var addons = false;
    const nextStep = () =>
      setStep((step) =>
        step + !datePicker && !addons ? 3 : !datePicker ? 2 : !addons ? 1 : 1
      );
    const inventoryCheck = async () => {
      setLoading(true);
      const data = await fetchClient(
        "",
        "GET",
        `?action=eventInventory&url_slug=${selectedTicket.url_slug}`
      );
      setInventoryList(data.data);
      setLoading(false);
      nextStep();
    };
    const addonInventory = async (next) => {
      setLoading(true);
      const data = await fetchClient(
        "",
        "GET",
        `?action=addonInventory&url_slug=${selectedTicket.url_slug}`
      );
      const tempList = data.data.map((inventory) => {
        const selected = addonList.find((add) => add.id === inventory.id);
        return {
          ...inventory,
          qty: selected ? selected.qty : 0,
          selected: selected ? selected.selected : false,
        };
      });
      setAddonList(
        tempList
        // addonFilter === "All"
        //   ? tempList
        //   : tempList.filter((item) => item.tags.includes(addonFilter))
      );
      setTempAddonList(tempList);
      setStep((step) => step + next);
      setLoading(false);
    };
    if (!step) {
      setLoading(true);
      const data = await fetchClient(
        "",
        "GET",
        `?action=packageDetails&url_slug=${selectedTicket.url_slug}`
      );
      if (data) {
        datePicker = data.data.enable_date_picker === "1";
        addons = data.data.enable_addons === "1";
        setEnableDate(datePicker);
        setEnableAddons(addons);
        const convertDate = data.data.event_dates?.map((dd, idx) => {
          const selected = dateList.find((date) => date.value === dd);
          return {
            id: idx,
            title: moment(dd, "YYYY-MM-DD").format("LLLL"),
            value: dd,
            selected: selected ? selected.selected : false,
          };
        });
        setDateList(convertDate || []);
        if (datePicker) {
          inventoryCheck();
        } else if (addons) {
          addonInventory(2);
        } else {
          setLoading(false);
          nextStep();
        }
      }
    } else if (step === 1 && enableAddons) {
      addonInventory(1);
    } else {
      setStep(step === 2 && !enableAddons ? 3 : step === 3 ? 4 : 3);
    }
  };

  const handlePreviousStep = () => {
    setCoupon("");
    setCouponApplied({ success: false, show: false });
    setDeductedValue(0);
    if (loading) {
      return;
    }
    setStep(
      step === 4
        ? 3
        : (step === 3 && !enableAddons && !enableDate) ||
          (step === 2 && !enableDate) ||
          step === 1
        ? 0
        : (step === 3 && !enableAddons && enableDate) ||
          (step === 2 && enableDate)
        ? 1
        : step === 3 && !enableDate && enableAddons
        ? 2
        : 2
    );
  };

  useEffect(() => {
    let total = 0;
    const ticketQty = selectedTicket.qty || 0;
    const ticketPrice = selectedTicket.price || 0;
    const dateQty = dateList.filter((date) => date.selected).length;

    // Calculate ticket total with selected dates
    let ticketTotal = ticketPrice * ticketQty;
    if (dateQty) {
      ticketTotal *= dateQty;
    }
    total += ticketTotal;

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

    // Subtract deducted value
    total -= deductedValue;

    // Set total to the pay amount
    setPayAmount(total);
  }, [
    addonList,
    dateList,
    selectedTicket.qty,
    selectedTicket.price,
    deductedValue,
  ]);

  const handlePay = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const param = {
      packages: [
        {
          package_id: selectedTicket.id,
          // date: dateList.filter((dt) => dt.selected).map((date) => date.value),
          date:
            dateList.filter((dt) => dt.selected).length > 0
              ? dateList.filter((dt) => dt.selected).map((date) => date.value)
              : dateList.map((date) => date.value),
          tickets: ticketList
            .find((ticket) => ticket.id === selectedTicket.id)
            .tickets.map((tkt) => {
              return { ticket_id: tkt.id, qty: selectedTicket.qty };
            }),
          addons: addonList
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
            }),
        },
      ],
      coupon: coupon,
    };
    const formData = new FormData();
    formData.append("action", "createPurchase");
    formData.append("items", JSON.stringify(param));
    const data = await fetchClient(formData, "POST", "");
    if (data.purchase_number) {
      // window.analytics.track("Checkout Started", {
      //   order_id: data.purchase_number,
      //   value: data.total,
      //   currency: "AED",
      //   products: [
      //     {
      //       name: selectedTicket.package_name,
      //       price: payAmount,
      //     },
      //   ],
      // });

      // Storing the data in localStorage
      localStorage.setItem("lastAnalyticsData", JSON.stringify(data));

      setPurchaseData(data);
      setStep(4);
      // const user = JSON.parse(localStorage.getItem("ajs_user_traits"));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "addToCart",
        // email: user.email,
        ecommerce: {
          currencyCode: "AED",
          add: {
            products: [
              {
                order_id: data.purchase_number,
                value: data.total,
                products: [
                  {
                    name: selectedTicket.package_name,
                    price: payAmount,
                  },
                ],
              },
            ],
          },
        },
      });
    }
    setLoading(false);
  };

  const paymentProcess = async () => {
    const url = await initiatePayment("tahseel");
    if (url) window.location.href = url;
  };

  const initiatePayment = async (method) => {
    const formData = new FormData();
    formData.append("action", "initiatePayment");
    formData.append("purchase_number", purchaseData.purchase_number);
    formData.append("type", method);
    formData.append(
      "redirect_to",
      `${window.location.origin}/view-ticket/${purchaseData.purchase_number}`
    );
    const data = await fetchClient(formData, "POST", "");
    // window.analytics.track("Payment Info Entered", {
    //   checkout_id: purchaseData.purchase_number,
    // });
    setLoading(false);
    return data.payment_url || "";
  };

  const applyCoupon = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const param = {
      packages: [
        {
          package_id: selectedTicket.id,
          date: dateList.filter((dt) => dt.selected).map((date) => date.value),
          tickets: ticketList
            .find((ticket) => ticket.id === selectedTicket.id)
            .tickets.map((tkt) => {
              return { ticket_id: tkt.id, qty: selectedTicket.qty };
            }),
          addons: addonList
            .filter((addon) => addon.qty > 0)
            .map((add) => {
              return { id: add.id, qty: add.qty };
            }),
        },
      ],
      coupon: coupon,
    };
    const formData = new FormData();
    formData.append("action", "validateCoupon");
    formData.append("items", JSON.stringify(param));
    const data = await fetchClient(formData, "POST", "");
    if (data.success) {
      setCouponApplied({
        success: data.data.coupon ? true : false,
        show: true,
      });
      if (data.data.coupon)
        setDeductedValue(data.data.packages[0].deducted_value);
    }
    setLoading(false);
  };

  const handleClosePay = () => {
    setCoupon("");
    setCouponApplied({ success: false, show: false });
    setDeductedValue(0);
    setCloseToStep0(true);
  };

  const closePopup = () => {
    setCloseToStep0(false);
    setTimer("15:00");
    setPercent(98.8);
    setPopupOpen(false);
    setPayAmount(0);
    setDateList([]);
    setAddonList([]);
    setSelectedTicket({});
    setCoupon("");
    setCouponApplied({ success: false, show: false });
    setDeductedValue(0);
    setStep(0);
  };

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
    const baseDate = new Date("2025-11-21"); // Base date: 22 Nov 2024
    const selectedDate = new Date(dateStr);

    // Calculate the difference in days from the base date
    const dayDifference =
      Math.floor((selectedDate - baseDate) / (1000 * 60 * 60 * 24)) + 1;

    return `Day ${dayDifference}`;
  };

  const handleSearch = () => {
    console.log(tempAddonList);

    const filter = tempTicketList.filter((elm) => elm.url_slug === ticketSlug);
    console.log(filter);
    setTicketList(filter);
  };

  return (
    <div>
      {!step && ticketList.length === 0 && (
        <div className="pay flex flex-col min-h-full sm:px-6 lg:px-8 h-[100vh] sm:h-auto pb-0">
          <div className="flex flex-row justify-between items-center shadow-[0_4px_4px_-1px_rgba(0,0,0,0.1)] p-6 sm:px-6 sm:py-6 mx-auto w-full sticky top-0 bg-[#fff] z-10">
            <div className="flex"></div>
            <img
              src={Logo}
              alt="Visa and Mastercard Logos"
              className={`h-[30px] w-[100%] object-contain`}
            />
            <div className="flex"></div>
          </div>
          <div className="flex flex-1 flex-col px-6 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6  h-min-[100vh] sm:h-auto pb-0 justify-start">
            <div className="flex flex-row justify-between items-center w-full">
              <h2 className="text-[26px] mt-[1rem] mb-[1rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
                Search Ticket
              </h2>
            </div>
            <div className="relative">
              <input
                id="slug"
                name="slug"
                type="text"
                required
                placeholder=" "
                value={ticketSlug}
                disabled={loading}
                onChange={(e) => setTicketSlug(e.target.value)}
                className={`border ${
                  ticketSlug !== ""
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-primary-orange border-solid border-2" // border-2 looks accurate to the design
                    : "border-secondary-orange border-solid border-2" // If we put border-1 and 2 above, it will have a minor UI breakage
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  top-2 text-primary-orange transition-all duration-300 ${
                  ticketSlug !== ""
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Ticket
              </label>
            </div>
            <div className="flex w-full sticky sm:static bottom-0 sm:bottom-auto">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className={`flex sm:my-10 h-16 sm:rounded-lg w-full justify-center items-center ${
                  !loading && "cursor-pointer"
                }   overflow-hidden  px-[1rem] py-[2rem] text-base px-[28px] py-[16px] text-center bg-primary-orange font-medium text-white shadow-sm focus-visible:outline`}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
      {!step && ticketList.length && (
        <Tickets
          hideFilter={true}
          tempTicketList={tempTicketList}
          ticketList={ticketList}
          setTicketList={setTicketList}
          setDateList={setDateList}
          setAddonList={setAddonList}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          tempSelectedTicket={tempSelectedTicket}
          setTempSelectedTicket={setTempSelectedTicket}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          handleNextStep={handleNextStep}
          setAddonFilter={setAddonFilter}
          qty={qty}
          setQty={setQty}
          payAmount={payAmount}
          loading={loading}
          packageLoading={packageLoading}
        />
      )}
      {step === 1 && enableDate && (
        <DatePicker
          qty={selectedTicket.qty}
          handleNextStep={handleNextStep}
          dates={dateList}
          setDateList={setDateList}
          selectedTicket={selectedTicket}
          payAmount={payAmount}
          inventoryList={inventoryList}
          handlePreviousStep={handlePreviousStep}
          loading={loading}
        />
      )}
      {step === 2 && enableAddons && (
        <Addons
          qty={selectedTicket.qty}
          addonList={addonList}
          selectedAddon={selectedAddon}
          setSelectedAddon={setSelectedAddon}
          payAmount={payAmount}
          setAddonList={setAddonList}
          tempAddonList={tempAddonList}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          addonFilter={addonFilter}
          setAddonFilter={setAddonFilter}
          loading={loading}
          dates={dateList}
          filters={filters}
          subCategories={subCategories}
        />
      )}
      {step === 3 && (
        <Summary
          handleNextStep={handleNextStep}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
          setSelectedTicket={setSelectedTicket}
          setStep={setStep}
          coupon={coupon}
          applyCoupon={applyCoupon}
          setCoupon={setCoupon}
          handlePay={handlePay}
          selectedTicket={selectedTicket}
          addonList={addonList}
          orderData={{
            ticketInfo:
              selectedTicket.enable_date_picker === "1"
                ? dateList
                    .filter((dt) => dt.selected)
                    .map((date) => {
                      return {
                        date: moment(date.value, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        ),
                        "Unit price": `${selectedTicket.price} AED`,
                        Quantity: selectedTicket.qty,
                        Price: `${
                          selectedTicket.price * selectedTicket.qty
                        } AED`,
                      };
                    })
                : [
                    {
                      date: "",
                      "Unit price": `${selectedTicket.price} AED`,
                      Quantity: selectedTicket.qty,
                      Price: `${selectedTicket.price * selectedTicket.qty} AED`,
                    },
                  ],
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
          deductedValue={deductedValue}
          couponApplied={couponApplied}
          loading={loading}
          setCloseToStep0={setCloseToStep0}
        />
      )}
      {step === 4 && (
        <Pay
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
          handlePay={handlePay}
          payAmount={payAmount}
          purchaseData={purchaseData}
          setPayAmount={setPayAmount}
          setSelectedTicket={setSelectedTicket}
          setStep={setStep}
          timer={timer}
          percent={percent}
          paymentUrl={paymentUrl}
          paymentProcess={paymentProcess}
          isPopupOpen={isPopupOpen}
          closePopup={closePopup}
          loading={loading}
          applePaymentUrl={applePaymentUrl}
          setCloseToStep0={setCloseToStep0}
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
