import { useEffect, useState } from "react";

import { quantityActions } from "../../constants/index";
import BackButton from "../BackButton";

import CaretIcon from "../Icons/CaretIcon";
import carelSvg from "../../assets/caret.svg";
import carelWhite from "../../assets/caretWhite.svg";
import Loader from "../Loader";

const noop = () => null;

export default function Addons({
  addonList = [],
  selectedAddon = {},
  setSelectedAddon = noop,
  handleNextStep,
  setAddonList = noop,
  tempAddonList,
  selectedTicket,
  handlePreviousStep,
  payAmount,
  loading,
  addonFilter,
  setAddonFilter,
  dates,
}) {
  const filters = ["All", "Activities", "Tents", "GYOT", "Glamping", "Hotels"];
  const [activeDate, setActiveDate] = useState(null);

  // Initialize addonList with `selectedDates` when the component mounts
  useEffect(() => {
    const addonListWithSelectedDates = addonList.map((addon) => ({
      ...addon,
      selectedDates: addon.selectedDates || [], // Add `selectedDates` if it doesn't exist
    }));
    setAddonList(addonListWithSelectedDates);
  }, []);

  const handleExpand = async (addon) => {
    // if (selectedAddon.id === addon.id) {
    //   setSelectedAddon({});
    //   const tempaddonList = addonList.map((tkt) => {
    //     if (tkt.id === addon.id) tkt.showMore = false;
    //     return tkt;
    //   });
    //   setAddonList(tempaddonList);
    //   return;
    // }

    if (loading) {
      return;
    }
    const expandAddonFn = async () => {
      const tempaddonList = addonList.map((tkt) => {
        if (tkt.id === addon.id) {
          tkt.selected = !tkt.selected;
          tkt.showMore = !tkt.showMore;
        }
        return tkt;
      });
      setAddonList(tempaddonList);
    };
    // const scrollToAddon = () => {
    //   const addonElm = document.querySelector(`#addonCard${addon.id}`);
    //   if (addonElm && addonElm?.scrollIntoView)
    //     addonElm.scrollIntoView({
    //       behavior: "smooth",
    //     });
    // };

    expandAddonFn();
    // setTimeout(scrollToAddon, 10); // #note MS can be increased to 100 for more time
  };

  const handleQuantity = (action, id) => {
    if (loading) {
      return;
    }
    const updateList = (list) => {
      return list.map((addon) => {
        if (id === addon.id)
          if (
            action === quantityActions.INCREMENT &&
            addon.qty < Number(addon.available_inventory)
          )
            addon.qty += 1;
          else if (action === quantityActions.DECREMENT && addon.qty > 0)
            addon.qty -= 1;
        return addon;
      });
    };
    const orgList = updateList(addonList);
    setAddonList(orgList);
  };

  const handleFilterChange = (filter) => {
    if (loading) {
      return;
    }
    // const list = tempAddonList.map((addon) => {
    //   addon.qty = 0;
    //   addon.selected = false;
    //   return addon;
    // });
    // setAddonList(
    //   filter === "All"
    //     ? tempAddonList
    //     : tempAddonList.filter((item) => item.tags.includes(filter))
    // );
    setAddonFilter(filter);
  };

  const inventoryCheck = () => {
    return (
      addonList.length > 0 &&
      addonList.filter((addon) => {
        if (addonFilter === "All") {
          return Number(addon.available_inventory) > 0;
        } else {
          return (
            Number(addon.available_inventory) > 0 &&
            addon.tags.includes(addonFilter)
          );
        }
      }).length > 0
    );
  };

  // Function to group slots by date
  const groupByDate = (slots) => {
    const availableDates = dates
      .filter((date) => date.selected) // Only consider selected dates
      .map((date) => date.value);
    return slots.reduce((acc, slot) => {
      const date = slot.event_date.split(" ")[0]; // Extract only the date part
      if (availableDates.includes(date)) {
        // Check if the date is in availableDates
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
      }
      return acc;
    }, {});
  };

  // Function to format date to "22 Nov"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(date);
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

  // Handle Date Selection
// Handle Date Selection
const handleDateChange = (addon_id, date, groupedDates) => {
  setAddonList((prevAddonList) =>
    prevAddonList.map((addon) => {
      if (addon.id === addon_id) {
        const existingDateIndex = addon.selectedDates.findIndex(
          (d) => d.date === date
        );

        if (existingDateIndex !== -1) {
          // Date already exists, remove it
          const newSelectedDates = [...addon.selectedDates];
          newSelectedDates.splice(existingDateIndex, 1); // Remove the date
          return { ...addon, selectedDates: newSelectedDates };
        } else {
          // Safely access groupedDates
          const timeSlotId = groupedDates?.[date]?.find(slot => slot.time_slot === null)?.id || null;

          // Add the new date with the time slot and corresponding time_slot_id
          return {
            ...addon,
            selectedDates: [
              ...addon.selectedDates,
              { date, timeSlot: null, time_slot_id: timeSlotId }, // Use the obtained time_slot_id
            ],
          };
        }
      }
      return addon;
    })
  );

  // Update the active date
  setActiveDate(date);
};


  // Handle Time Slot Selection
  const handleSlotChange = (addon_id, e, date) => {
    const timeSlot = e.target.value;
    const timeSlotId = e.target.getAttribute("data-timeslot-id"); // Retrieve the time_slot_id from the attribute

    setAddonList((prevAddonList) =>
      prevAddonList.map((addon) => {
        if (addon.id === addon_id) {
          return {
            ...addon,
            selectedDates: addon.selectedDates.map((d) =>
              d.date === date ? { ...d, timeSlot, time_slot_id: timeSlotId } : d
            ),
          };
        }
        return addon;
      })
    );
  };

  return (
    <div className="addons flex flex-col min-h-full   sm:px-6 sm:py-12   h-[100vh] sm:h-auto pb-0  ">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6 sm:py-12 h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          {" "}
          <span onClick={handlePreviousStep}>
            <BackButton />
          </span>
          <h2 className="mt-10 mb-[2rem] text-left w-[99%] sm:w-full  text-4xl leading-9 tracking-tight text-primary-orange">
            Select your add-ons
          </h2>
          <div className="flex w-full overflow-scroll gap-[12px]">
            {filters.map((filter, i) => (
              <div
                key={i}
                className={`whitespace-nowrap rounded-[200px] px-[1rem] py-[0.2rem] border ${
                  !loading && "cursor-pointer"
                } ${
                  addonFilter === filter
                    ? "text-white bg-secondary-orange border-secondary-orange"
                    : "text-secondary-orange border-secondary-orange"
                } text-sm font-medium text-left `}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
          <div className="my-6 flex flex-col gap-[30px]">
            {inventoryCheck() ? (
              <>
                {addonList
                  .filter((item) =>
                    addonFilter !== "All"
                      ? item.tags.includes(addonFilter)
                      : item
                  )
                  .sort((a, b) => a.position - b.position)
                  .map((addon, i) => {
                    const groupedDates = groupByDate(addon.slots, dates);
                    return (
                      Number(addon.available_inventory) > 0 && (
                        <div
                          key={i}
                          id={`addonCard${addon.id}`}
                          className={`addon rounded-lg ${
                            !loading && "cursor-pointer"
                          } px-[28px] py-[15px] transition-all ease-in-out duration-500 ${
                            addon.selected
                              ? "bg-primary-orange"
                              : "bg-[#FFF7E0]"
                          }   `}
                        >
                          <div className="flex justify-between ">
                            <div className="flex flex-col justify-between flex-[0.8]">
                              <p
                                className={`text-base  mb-3 ${
                                  addon.selected
                                    ? "font-medium text-white"
                                    : // #note: font weight is medium in design
                                      // but here, semibold is more readable and closer to design look
                                      "font-semibold text-primary-orange"
                                }`}
                              >
                                {addon.name}
                              </p>
                              <p
                                className={`w-[100%] text-sm   text-left ${
                                  addon.selected
                                    ? "text-l-orange"
                                    : "text-primary-orange"
                                }`}
                              >
                                {addon.desc}
                              </p>
                              {/* {addon.selected && ( */}
                              <p
                                className={`w-[100%] text-sm text-left ${
                                  addon.selected
                                    ? "text-l-orange"
                                    : "text-primary-orange"
                                }`}
                              >
                                Tickets Selected : {addon.qty}
                              </p>
                              <p
                                className={`w-[100%] text-sm text-left ${
                                  addon.selected
                                    ? "text-l-orange"
                                    : "text-primary-orange"
                                }`}
                              >
                                Price: AED {addon.price * addon.qty}
                              </p>
                              {/* )} */}
                            </div>
                            {/* <div className="flex  justify-between items-end w-full h-auto  flex-[0.25]"> */}
                            <div className="flex flex-col justify-between items-end text-right  h-50">
                              <span>
                                <p
                                  className={`text-base font-medium text-right  ${
                                    addon.selected
                                      ? "text-white"
                                      : "text-primary-orange font-semibold"
                                  }`}
                                >
                                  AED {addon.price}
                                </p>{" "}
                                <p
                                  // text-xs
                                  className={`text-[11px] hidden text-right  ${
                                    addon.selected
                                      ? "opacity-50 text-white"
                                      : "text-primary-orange"
                                  }`}
                                >
                                  Per person
                                </p>
                              </span>

                              <img
                                src={addon.selected ? carelWhite : carelSvg}
                                alt="carelSvg"
                                className={`h-[24px] w-[24px]`}
                                onClick={() => handleExpand(addon)}
                              />
                            </div>
                          </div>

                          {addon.selected && (
                            <div className={`py-[1rem] mt-[1rem]`}>
                              <div className="border border-[#E9E9EB] opacity-20 mb-5" />
                              <div
                                className={`flex justify-between text-white items-center`}
                              >
                                <div
                                  className={`text-sm text-left text-[#fbe899] `}
                                >
                                  Quantity
                                </div>
                                <div className={`flex`}>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantity(
                                        quantityActions.DECREMENT,
                                        addon.id
                                      );
                                    }}
                                    className="h-[30px] w-[30px] rounded-[2rem] text-center border border-[#FBE899] cursor-pointer flex flex-col items-center justify-center"
                                  >
                                    <svg
                                      width={12}
                                      height={2}
                                      viewBox="0 0 12 2"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      // className="flex-grow-0 flex-shrink-0"
                                      preserveAspectRatio="none"
                                    >
                                      <path d="M12 0H0V2H12V0Z" fill="white" />
                                    </svg>
                                  </div>
                                  <div
                                    className={` mx-[0.8rem] my-[auto] text-base font-medium text-left text-white `}
                                  >
                                    {addon.qty}
                                  </div>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantity(
                                        quantityActions.INCREMENT,
                                        addon.id
                                      );
                                    }}
                                    className="h-[30px] w-[30px] rounded-[2rem] text-center border border-[#FBE899] cursor-pointer flex flex-col items-center justify-center"
                                  >
                                    <svg
                                      width={12}
                                      height={12}
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                    >
                                      <path
                                        d="M6.90918 0H5.09082V5.09082H0V6.90918H5.09082V12H6.90918V6.90918H12V5.09082H6.90918V0Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              {/* TIME SLOTS - START */}
                              {addon.slots.length > 0 && (
                                <>
                                  <div>
                                    <h3 className="text-l-orange w-[100%] text-sm mb-2">
                                      Date & Time:
                                    </h3>
                                    <div className="flex space-x-4 mb-4">
                                      {Object.keys(groupedDates).map((date) => (
                                        <div key={date} className="mb-4">
                                          {" "}
                                          {/* Add margin-bottom for spacing */}
                                          <div className="flex items-center">
                                            <input
                                              type="checkbox"
                                              id={date}
                                              checked={addon.selectedDates.some(
                                                (d) => d.date === date
                                              )}
                                              onChange={() =>
                                                handleDateChange(addon.id, date, groupedDates)
                                              } // Toggle checkbox state
                                              className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label
                                              htmlFor={date}
                                              className="ml-2 text-l-orange text-sm cursor-pointer"
                                              onClick={(e) => {
                                                e.preventDefault(); // Prevent checkbox toggle on label click
                                                setActiveDate(date); // Show time slots on label click
                                              }}
                                            >
                                              {`${calculateDay(
                                                date
                                              )} - ${formatDate(date)}`}
                                            </label>
                                          </div>
                                          {/* Show time slots below the date label if this date is active */}
                                          {activeDate === date && (
                                            <div className="mt-2">
                                              {" "}
                                              {/* Margin-top for spacing */}
                                              {addon.selectedDates.map(
                                                (selectedDateObj) =>
                                                  selectedDateObj.date ===
                                                  date ? (
                                                    groupedDates[
                                                      selectedDateObj.date
                                                    ]?.some(
                                                      (slot) =>
                                                        slot.time_slot !== null
                                                    ) ? ( // Check for non-null time slots
                                                      <div
                                                        key={
                                                          selectedDateObj.date
                                                        }
                                                      >
                                                        {groupedDates[
                                                          selectedDateObj.date
                                                        ].map(
                                                          (slot) =>
                                                            slot.time_slot !==
                                                              null && ( // Render only if time_slot is not null
                                                              <label
                                                                key={slot.id}
                                                                className="flex items-center mb-2 cursor-pointer"
                                                              >
                                                                <input
                                                                  type="radio"
                                                                  name={`time_slot_${addon.id}_${selectedDateObj.date}`}
                                                                  value={
                                                                    slot.time_slot
                                                                  }
                                                                  data-timeslot-id={
                                                                    slot.id
                                                                  }
                                                                  checked={
                                                                    selectedDateObj.timeSlot ===
                                                                    slot.time_slot
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    handleSlotChange(
                                                                      addon.id,
                                                                      e,
                                                                      selectedDateObj.date
                                                                    )
                                                                  }
                                                                  className="h-5 w-5 border border-gray-300 rounded-full checked:bg-[#fbe899] checked:border-[#fbe899] focus:outline-none mr-3"
                                                                />
                                                                <span className="text-l-orange text-sm">
                                                                  {
                                                                    slot.time_slot
                                                                  }
                                                                </span>
                                                              </label>
                                                            )
                                                        )}
                                                      </div>
                                                    ) : null
                                                  ) : null
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                              {/* TIME SLOTS - END */}
                              {addon.img && (
                                <img
                                  className={`w-full my-[2rem] rounded-lg`}
                                  src={addon.img}
                                />
                              )}
                              {addon.highlights && (
                                <div className="ml-[1.5rem]">
                                  <ul>
                                    {addon.highlights.map((keyPoint, i) => (
                                      <li
                                        style={{
                                          listStyle: "disc",
                                        }}
                                        className={`${
                                          addon.selected
                                            ? "text-[#FBE899]"
                                            : "text-black"
                                        } mb-4 text-[15px] text-left`}
                                        key={i}
                                      >
                                        {keyPoint}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    );
                  })}
              </>
            ) : (
              <p className="text-[18px] mt-12 text-d-orange font-medium text-center">
                Sorry, No Addons are Available
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="sm:mx-auto  w-full sm:w-full sm:max-w-md sticky sm:static bottom-0 sm:bottom-auto">
        {/* <div className="flex justify-between items-center text-white bg-black p-[1rem] text-[14px] border-b-[2px] border-white">
          <div>Total</div>
          <div>{payAmount} AED</div>
        </div> */}
        <div
          onClick={handleNextStep}
          className={`relative overflow-hidden flex justify-between items-center text-white bg-primary-orange px-[1rem] py-[2rem] ${
            !loading && "cursor-pointer"
          }`}
        >
          <div className="w-full flex justify-between">
            <span>Total Cost: AED {payAmount}</span>
            <span className="mr-8">
              {addonList.filter((addon) => addon.qty > 0).length > 0
                ? "Continue"
                : "Skip and Continue"}
            </span>
          </div>

          {loading && <Loader />}
          <CaretIcon />
        </div>
      </div>
      {/* Styling for the event and slot display */}
      <style jsx>{`
        .event {
          border: 1px solid #ccc;
          margin-bottom: 20px;
          padding: 10px;
        }
        .event-header {
          cursor: pointer;
        }
        .event-header img {
          margin-right: 20px;
        }
        .event-details {
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );

  // return (
  //     <div className="flex flex-col justify-center items-center w-full mb-[48px] gap-[12px] px-6 py-12 lg:px-8">
  //         <h1 className="text-[24px]">Addons</h1>
  //         {addonList.map((addon) => (
  //             <div key={addon.id}>
  //                 <div className="flex justify-center items-center">
  //                     <label
  //                         htmlFor={`addon${addon.id}`}
  //                         className="text-[16px]"
  //                         onClick={() => setSelectedAddon(addon)}
  //                     >
  //                         <div
  //                             id={`addon${addon.id}`}
  //                             className={`${
  //                                 selectedAddon?.id === addon.id
  //                                     ? "bg-white"
  //                                     : "bg-primaryBg"
  //                             } w-[23rem] flex items-center p-[20px] rounded-[13px] cursor-pointer`}
  //                         >
  //                             <input
  //                                 type="radio"
  //                                 id={`addon${addon.id}`}
  //                                 name={`addon${addon.id}`}
  //                                 checked={selectedAddon?.id === addon.id}
  //                                 className="w-4 h-4 text-blue-600 rounded border-gray-300 border-[1px] bg-[#151515] mr-[15px]"
  //                             />
  //                             <div>
  //                                 <h3 className="text-[#111] text-[17px]">
  //                                     {addon.title}
  //                                 </h3>
  //                             </div>
  //                         </div>
  //                     </label>
  //                     <h3 className="ml-[3rem] text-[#111] text-[17px]">
  //                         {addon.price} AED
  //                     </h3>
  //                 </div>
  //             </div>
  //         ))}
  //         <button
  //
  // onClick={() => setStep((step) => step + 1)}
  //             className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  //         >
  //             Next
  //         </button>
  //     </div>
  // );
}
