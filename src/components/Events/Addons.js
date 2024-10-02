import { useEffect, useState } from "react";
import { quantityActions } from "../../constants/index";
import BackButton from "../BackButton";
import CaretIcon from "../Icons/CaretIcon";
import carelSvg from "../../assets/caret.svg";
import carelWhite from "../../assets/caretWhite.svg";
import Loader from "../Loader";
import { toast } from "react-toastify";

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
  filters,
  subCategories,
}) {
  const [activeDate, setActiveDate] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Preselect dates and set activeDate
  useEffect(() => {
    const addonListWithSelectedDates = addonList.map((addon) => ({
      ...addon,
      selectedDates: addon.selectedDates || [],
    }));
    setAddonList(addonListWithSelectedDates);

    // Automatically set activeDate to the first selected date (if any)
    addonList.forEach((addon) => {
      if (addon.selectedDates?.length > 0) {
        setActiveDate(addon.selectedDates[0]?.date); // Set first selected date as active
      }
    });
  }, []);

  const handleExpand = async (addon) => {
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
    expandAddonFn();
  };

  const handleQuantity = (action, id, groupedDates, showToast) => {
    if (loading) {
      return;
    }
  
    const updateList = (list) => {
      return list.map((addon) => {
        // Ensure qty is initialized if it's not defined
        if (typeof addon.qty === 'undefined' || addon.qty === null) {
          addon.qty = 0; // Initialize qty to 0
        }
  
        let maxAvailableInventory;
  
        // Check if slots are available
        if (addon.slots && addon.slots.length > 0) {
          // Calculate the maximum available inventory from the slots
          maxAvailableInventory = Math.max(
            ...addon.slots.map((slot) => Number(slot.available_inventory))
          );
        } else {
          // If there are no slots, use the addon available_inventory
          maxAvailableInventory = Number(addon.available_inventory);
        }
  
        // Stop incrementing qty if it matches or exceeds the maximum available inventory
        if (action === quantityActions.INCREMENT && addon.qty >= maxAvailableInventory) {
          toast.error(`Maximum available inventory is ${maxAvailableInventory}.`);
          return addon; // Prevent further actions if the qty matches or exceeds the max inventory
        }
  
        // Allow user to adjust qty
        if (action === quantityActions.INCREMENT) {
          addon.qty += 1;
        } else if (action === quantityActions.DECREMENT && addon.qty > 0) {
          addon.qty -= 1;
          if (addon.qty === 0) {
            addon.selectedDates = []; // Clear selected dates if qty is 0
          }
        }
  
        return addon;
      });
    };
  
    const orgList = updateList(addonList);
    setAddonList(orgList);
  };
  
  
  
  const inventoryCheck = () => {
    return (
      addonList.length > 0 &&
      addonList.filter((addon) => {
        const isAvailable = Number(addon.available_inventory) > 0;

        const matchesFilter =
          addonFilter === "All" ||
          addon.tags.some((tag) => {
            return typeof tag === "string"
              ? tag === addonFilter
              : tag.tag === addonFilter;
          });

        const matchesSubCategory = selectedSubCategory
          ? addon.tags.some(
              (tag) =>
                typeof tag === "object" &&
                tag.tag === addonFilter &&
                tag.sub_tags.includes(selectedSubCategory)
            )
          : true;

        // Return true only if all conditions are satisfied
        return isAvailable && matchesFilter && matchesSubCategory;
      }).length > 0
    );
  };

  // Function to group slots by date
  const groupByDate = (slots) => {
    const availableDates = dates
      .filter((date) => date.selected)
      .map((date) => date.value);

    if (availableDates.length === 0) {
      const uniqueDates = [
        ...new Set(slots.map((slot) => slot.event_date.split(" ")[0])),
      ];
      return uniqueDates.reduce((acc, date) => {
        acc[date] = slots.filter((slot) => slot.event_date.startsWith(date));
        return acc;
      }, {});
    }

    return slots.reduce((acc, slot) => {
      const date = slot.event_date.split(" ")[0];
      if (availableDates.includes(date)) {
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

  const handleDateChange = (addon_id, date, groupedDates) => {
    setAddonList((prevAddonList) =>
      prevAddonList.map((addon) => {
        if (addon.id === addon_id) {
          const isMultiSelect = groupedDates[date].some(
            (slot) => slot.time_slot === ""
          );
          const existingDateIndex = addon.selectedDates.findIndex(
            (d) => d.date === date
          );

          if (existingDateIndex !== -1) {
            // For multi-select, allow toggling off
            const newSelectedDates = [...addon.selectedDates];
            newSelectedDates.splice(existingDateIndex, 1);
            return { ...addon, selectedDates: newSelectedDates };
          } else {
            // Automatically select time slot if only one is available
            const availableSlots = groupedDates[date].filter(
              (slot) => slot.time_slot !== ""
            );
            const timeSlotId =
              availableSlots.length === 1 ? availableSlots[0].id : null;
            const timeSlot =
              availableSlots.length === 1 ? availableSlots[0].time_slot : null;

            const newDate = {
              date,
              timeSlot,
              time_slot_id: timeSlotId,
            };

            const updatedSelectedDates = isMultiSelect
              ? [...addon.selectedDates, newDate]
              : [newDate];

            return {
              ...addon,
              selectedDates: updatedSelectedDates,
            };
          }
        }
        return addon;
      })
    );

    // Update the active date only if it's not a multi-select date
    setActiveDate(
      groupedDates[date].some((slot) => slot.time_slot !== "") ? date : null
    );
  };

  // Handle Time Slot Selection
  // const handleSlotChange = (addon_id, e, date) => {
  //   const timeSlot = e.target.value;
  //   const timeSlotId = e.target.getAttribute("data-timeslot-id");

  //   setAddonList((prevAddonList) =>
  //     prevAddonList.map((addon) => {
  //       if (addon.id === addon_id) {
  //         // Update or replace the time slot for the given date
  //         const newSelectedDates = addon.selectedDates.map((sd) =>
  //           sd.date === date ? { date, timeSlot, time_slot_id: timeSlotId } : sd
  //         );

  //         return {
  //           ...addon,
  //           selectedDates: newSelectedDates,
  //         };
  //       }
  //       return addon;
  //     })
  //   );
  // };

  const handleSlotChange = (addonId, event, date, groupedDates) => {
    const timeSlot = event.target.value;
    const selectedSlotId = event.target.getAttribute("data-timeslot-id");
  
    setAddonList((prevAddonList) =>
      prevAddonList.map((addon) => {
        if (addon.id === addonId) {
          const selectedSlot = groupedDates[date].find(
            (slot) => slot.id === selectedSlotId
          );
          // Check if the selected slot has enough available inventory for the selected qty
          if (selectedSlot && addon.qty > selectedSlot.available_inventory) {
            alert(
              `Selected quantity (${addon.qty}) exceeds available inventory (${selectedSlot.available_inventory}) for this slot.`
            );
            return addon; // Do nothing if slot can't handle the quantity
          }
  
          // Proceed with normal time slot selection logic if the slot is valid
          const updatedSelectedDates = addon.selectedDates.map((d) => {
            if (d.date === date) {
              return {
                ...d,
                timeSlot: timeSlot, // Update time slot
                time_slot_id: selectedSlot.id,
              };
            }
            return d;
          });
  
          return { ...addon, selectedDates: updatedSelectedDates };
        }
        return addon;
      })
    );
  };
  

  const handleFilterChange = (filter) => {
    if (loading) {
      return;
    }
    setAddonFilter(filter);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const filteredAddons = addonList
    .filter((item) => {
      // If "All" is selected, return all items
      if (addonFilter === "All") return true;

      // If the addonFilter matches directly with the item's tags
      if (item.tags.includes(addonFilter)) return true;

      // Check if item has the addonFilter as an object and selectedSubCategory is in sub_tags
      return item.tags.some((tag) => {
        return (
          typeof tag === "object" &&
          tag.tag === addonFilter &&
          (!selectedSubCategory || tag.sub_tags.includes(selectedSubCategory))
        );
      });
    })
    .sort((a, b) => a.position - b.position);

  // Get available subcategories based on the selected addonFilter
  const availableSubCategories = subCategories[addonFilter] || [];

  const handleNextStepWithValidation = () => {
    // Check if any addon has quantity > 0 but no date selected, skipping the check if slots is empty
    const hasMissingDate = addonList.some(
      (addon) =>
        addon.qty > 0 &&
        addon.slots.length > 0 &&
        addon.selectedDates.length === 0
    );

    // Check if any addon has date selected but quantity is 0, skipping the check if slots is empty
    const hasMissingQuantity = addonList.some(
      (addon) =>
        addon.qty === 0 &&
        addon.slots.length > 0 &&
        addon.selectedDates.length > 0
    );

    // Check if selected dates require a time slot, but none is selected
    const hasMissingTimeSlot = addonList.some((addon) =>
      addon.selectedDates.some((selectedDate) => {
        // Find matching slot for the selected date
        const matchingSlot = addon.slots.find(
          (slot) => slot.event_date.split(" ")[0] === selectedDate.date
        );

        // If the matching slot has time slots, check if a time slot is selected
        return (
          matchingSlot &&
          matchingSlot.time_slot !== "" &&
          selectedDate.timeSlot === null
        );
      })
    );

    if (hasMissingDate) {
      // Show toast message if date is not selected for any addon with selected quantity
      toast.error("Please select a date for all addons you selected.");
      return; // Prevent proceeding to the next step
    }

    if (hasMissingQuantity) {
      // Show toast message if quantity is 0 but date is selected
      toast.error("Please select a quantity for all addons you selected.");
      return; // Prevent proceeding to the next step
    }

    if (hasMissingTimeSlot) {
      // Show toast message if a time slot is required but not selected
      toast.error("Please select a time slot for all selected dates.");
      return; // Prevent proceeding to the next step
    }

    // If all conditions pass, proceed to the next step
    handleNextStep();
  };


  // Function to check if the entire tab (date) should be disabled
const getIsTabDisabled = (addon, date, groupedDates) => {
  // Check if all time slots on this date have insufficient available inventory
  return groupedDates[date].every(
    (slot) => addon.qty > slot.available_inventory
  );
};

// Function to check if a particular time slot should be disabled
const getIsSlotDisabled = (addon, slot) => {
  // Disable the slot if its available inventory is less than the selected quantity
  return addon.qty > slot.available_inventory;
};

  return (
    <div className="addons flex flex-col min-h-full sm:px-6 sm:py-12 h-[100vh] sm:h-auto pb-0">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg sm:px-6 sm:py-12 h-[100vh] overflow-y-auto">
        <div>
          <span onClick={handlePreviousStep}>
            <BackButton />
          </span>
          <h2 className="mt-10 mb-[2rem] text-left w-[99%] sm:w-full text-4xl leading-9 tracking-tight text-primary-orange">
            Select your add-ons
          </h2>
          <div className="flex w-full overflow-x-auto gap-[12px] scrollbar-thin">
            {filters.map((filter, i) => (
              <div
                key={i}
                className={`whitespace-nowrap rounded-full px-[1rem] py-[0.2rem] border ${
                  !loading && "cursor-pointer"
                } ${
                  addonFilter === filter
                    ? "text-white bg-secondary-orange border-secondary-orange"
                    : "text-secondary-orange border-secondary-orange"
                } text-sm font-medium text-left`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
          {/* Render Subcategories */}
          {addonFilter && availableSubCategories.length > 0 && (
            <div className="flex w-full overflow-auto gap-2 mt-6">
              {availableSubCategories.map((sub, i) => (
                <div
                  key={i}
                  className={`whitespace-nowrap rounded-lg px-4 py-0 border ${
                    !loading && "cursor-pointer"
                  } ${
                    selectedSubCategory === sub
                      ? "text-white bg-secondary-orange border-secondary-orange"
                      : "text-secondary-orange border-gray-300"
                  } text-sm font-medium text-center transition-all duration-200`}
                  onClick={() => handleSubCategoryChange(sub)}
                >
                  {sub}
                </div>
              ))}
            </div>
          )}
          <div className="my-6 flex flex-col gap-[30px]">
            {inventoryCheck() ? (
              <>
                {filteredAddons.map((addon, i) => {
                  const groupedDates = groupByDate(addon.slots, dates);
                  return (
                    Number(addon.available_inventory) > 0 && (
                      <div
                        key={i}
                        id={`addonCard${addon.id}`}
                        className={`addon rounded-lg ${
                          !loading && "cursor-pointer"
                        } px-[28px] py-[15px] transition-all ease-in-out duration-500 ${
                          addon.selected ? "bg-primary-orange" : "bg-[#FFF7E0]"
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
                              Quantity Selected : {addon.qty}
                            </p>
                            <p
                              className={`w-[100%] text-sm text-left ${
                                addon.selected
                                  ? "text-l-orange"
                                  : "text-primary-orange"
                              }`}
                            >
                              Price: AED{" "}
                              {addon.selectedDates &&
                              addon.selectedDates.length !== 0
                                ? addon.price *
                                  addon.qty *
                                  addon.selectedDates.length
                                : addon.price * addon.qty}
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
                              </p>
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
                                Select Quantity
                              </div>
                              <div className={`flex`}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantity(
                                      quantityActions.DECREMENT,
                                      addon.id,
                                      groupedDates
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
                                      addon.id,
                                      groupedDates
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
                                    Select Date & Time:
                                  </h3>
                                  <div className="flex flex-wrap space-x-4 mb-4">
                                    {Object.keys(groupedDates).map((date) => {
                                      const allDayEvent = groupedDates[
                                        date
                                      ].some((slot) => slot.time_slot === "");
                                      const selectedDate =
                                        addon.selectedDates?.find(
                                          (d) => d.date === date
                                        );
                                      const isSelected = !!selectedDate;

                                      // Disable the tab if available inventory is less than the selected qty
                                      const isTabDisabled = groupedDates[
                                        date
                                      ].every(
                                        (slot) =>
                                          addon.qty > slot.available_inventory
                                      );

                                      return (
                                        <div key={date} className="mb-4">
                                          <div className="flex items-center">
                                            {!allDayEvent ? (
                                              // Tab-like UI when `allDayEvent` is true
                                              <div
                                                onClick={() => {
                                                  if (addon.qty > 0 && !getIsTabDisabled(addon, date, groupedDates)) {
                                                    // Only allow date selection if quantity is greater than 0 and tab is not disabled
                                                    handleDateChange(addon.id, date, groupedDates);
                                                    setActiveDate(date); // Set active date to show time slots for tabs
                                                  } 
                                                }}
                                                className={`cursor-pointer px-4 py-1 border ${
                                                  isSelected
                                                    ? "border-blue-600 bg-[#fff] text-primary-orange"
                                                    : "border-gray-300 text-l-orange"
                                                } rounded-lg text-sm ${
                                                  addon.qty === 0 || getIsTabDisabled(addon, date, groupedDates)
                                                    ? "cursor-not-allowed opacity-50"
                                                    : ""
                                                }`} // Disable styles when qty is 0
                                              >
                                                {formatDate(date)}
                                              </div>
                                            ) : (
                                              // Checkbox UI when `allDayEvent` is false
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id={date}
                                                  name="date_selection"
                                                  checked={isSelected}
                                                  onChange={(e) => {
                                                    handleDateChange(
                                                      addon.id,
                                                      date,
                                                      groupedDates,
                                                      e.target.checked
                                                    );
                                                    setActiveDate(date); // Set active date to show time slots for checkboxes
                                                  }}
                                                  disabled={addon.qty === 0}
                                                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label
                                                  htmlFor={date}
                                                  className="ml-2 text-l-orange text-sm cursor-pointer"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    const inputElement =
                                                      document.getElementById(
                                                        date
                                                      );
                                                    if (!inputElement.checked) {
                                                      inputElement.click();
                                                    }
                                                  }}
                                                >
                                                  {`${formatDate(date)}`}
                                                </label>
                                              </div>
                                            )}
                                          </div>

                                          {/* Ensure time slots are displayed when activeDate matches the selected date */}
                                          {activeDate === date &&
                                            selectedDate &&
                                            !allDayEvent && (
                                              <div className="mt-2">
                                                {groupedDates[date].map(
                                                  (slot, index) => {
                                                    const isTimeSlotSelected =
                                                      selectedDate?.timeSlot ===
                                                      slot.time_slot;
                                                      const isSlotDisabled = getIsSlotDisabled(addon, slot);
                                                    return (
                                                      slot.time_slot && (
                                                        <label
                                                          key={index}
                                                          className={`flex items-center mb-2 cursor-pointer ${
                                                            isSlotDisabled ? "cursor-not-allowed opacity-50" : ""
                                                          }`}
                                                        >
                                                          <input
                                                            type="radio"
                                                            name={`time_slot_${addon.id}_${date}`}
                                                            value={
                                                              slot.time_slot
                                                            }
                                                            data-timeslot-id={
                                                              slot.id
                                                            }
                                                            checked={
                                                              isTimeSlotSelected
                                                            }
                                                            onChange={(e) =>
                                                              handleSlotChange(
                                                                addon.id,
                                                                e,
                                                                date,
                                                                groupedDates
                                                              )
                                                            }
                                                            disabled={
                                                              isSlotDisabled
                                                            }
                                                            className="h-4 w-4 border border-gray-300 rounded-full checked:bg-[#fbe899] checked:border-[#fbe899] focus:outline-none mr-3"
                                                          />
                                                          <span className="text-l-orange text-sm">
                                                            {slot.time_slot}
                                                          </span>
                                                        </label>
                                                      )
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      );
                                    })}
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
        <div
          // onClick={canProceed() ? handleNextStep : null}
          onClick={!loading ? handleNextStepWithValidation : null}
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
    </div>
  );
}
