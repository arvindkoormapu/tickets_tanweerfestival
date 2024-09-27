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
  filters,
  subCategories,
}) {
  const [activeDate, setActiveDate] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    const addonListWithSelectedDates = addonList.map((addon) => ({
      ...addon,
      selectedDates: addon.selectedDates || [],
    }));
    setAddonList(addonListWithSelectedDates);
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
    console.log('orgList', orgList)
    setAddonList(orgList);
  };

  const inventoryCheck = () => {
    return (
      addonList.length > 0 &&
      addonList.filter((addon) => {
        const isAvailable = Number(addon.available_inventory) > 0;

        const matchesFilter =
          addonFilter === "All" ||
          addon.tags.some((tag) =>
            typeof tag === "string"
              ? tag === addonFilter
              : tag.tag === addonFilter
          );

        const matchesSubCategory = selectedSubCategory
          ? addon.tags.some(
              (tag) =>
                typeof tag === "object" &&
                tag.tag === addonFilter &&
                tag.sub_tags.includes(selectedSubCategory)
            )
          : true;

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

  const calculateDay = (dateStr) => {
    const baseDate = new Date("2024-11-22");
    const selectedDate = new Date(dateStr);

    const dayDifference =
      Math.floor((selectedDate - baseDate) / (1000 * 60 * 60 * 24)) + 1;

    return `Day ${dayDifference}`;
  };

  // Handle Date Selection
  const handleDateChange = (addon_id, date, groupedDates) => {
    setAddonList((prevAddonList) =>
      prevAddonList.map((addon) => {
        if (addon.id === addon_id) {
          const isMultiSelect = groupedDates[date].some(
            (slot) => slot.time_slot === null
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
            // For single-select, clear all other dates
            const timeSlotId =
              groupedDates[date].find((slot) => slot.time_slot === null)?.id ||
              null;
            const newDate = { date, timeSlot: null, time_slot_id: timeSlotId };
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
      groupedDates[date].some((slot) => slot.time_slot !== null) ? date : null
    );
  };

  // Handle Time Slot Selection
  const handleSlotChange = (addon_id, e, date) => {
    const timeSlot = e.target.value;
    const timeSlotId = e.target.getAttribute("data-timeslot-id");

    setAddonList((prevAddonList) =>
      prevAddonList.map((addon) => {
        if (addon.id === addon_id) {
          // Update or replace the time slot for the given date
          const newSelectedDates = addon.selectedDates.map((sd) =>
            sd.date === date ? { date, timeSlot, time_slot_id: timeSlotId } : sd
          );

          return {
            ...addon,
            selectedDates: newSelectedDates,
          };
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

  // Filter and sort the addons
  const filteredAddons = addonList
    .filter((item) => {
      if (addonFilter === "All") return true;

      if (item.tags.includes(addonFilter)) return true;

      return item.tags.some(
        (tag) =>
          typeof tag === "object" &&
          tag.tag === addonFilter &&
          tag.sub_tags.includes(selectedSubCategory)
      );
    })
    .filter((item) => {
      if (!selectedSubCategory) return true;
      return item.tags.some(
        (tag) =>
          typeof tag === "object" &&
          tag.tag === "Hotels" &&
          tag.sub_tags.includes(selectedSubCategory)
      );
    })
    .sort((a, b) => a.position - b.position);

  const availableSubCategories = subCategories[addonFilter] || [];

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
                                  <div className="flex flex-wrap space-x-4 mb-4">
                                    {Object.keys(groupedDates).map((date) => {
                                      const allDayEvent = groupedDates[
                                        date
                                      ].some((slot) => slot.time_slot === null);
                                      return (
                                        <div key={date} className="mb-4">
                                          <div className="flex items-center">
                                            <input
                                              type={
                                                allDayEvent
                                                  ? "checkbox"
                                                  : "radio"
                                              }
                                              id={date}
                                              name="date_selection"
                                              checked={addon.selectedDates?.some(
                                                (d) => d.date === date
                                              )}
                                              onChange={(e) => {
                                                handleDateChange(
                                                  addon.id,
                                                  date,
                                                  groupedDates,
                                                  e.target.checked
                                                );
                                                setActiveDate(date); // Set active date to show time slots for radio buttons
                                              }}
                                              className={`form-${
                                                allDayEvent
                                                  ? "checkbox"
                                                  : "radio"
                                              } h-4 w-4 text-blue-600 border-gray-300 rounded ${
                                                allDayEvent
                                                  ? ""
                                                  : "rounded-full"
                                              } focus:ring-blue-500`}
                                            />
                                            <label
                                              htmlFor={date}
                                              className="ml-2 text-l-orange text-sm cursor-pointer"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                const inputElement =
                                                  document.getElementById(date);
                                                if (!inputElement.checked) {
                                                  inputElement.click();
                                                }
                                              }}
                                            >
                                              {`${calculateDay(
                                                date
                                              )} - ${formatDate(date)}`}
                                            </label>
                                          </div>
                                          {activeDate === date &&
                                            !allDayEvent && (
                                              <div className="mt-2">
                                                {groupedDates[date].map(
                                                  (slot, index) =>
                                                    slot.time_slot && (
                                                      <label
                                                        key={index}
                                                        className="flex items-center mb-2 cursor-pointer"
                                                      >
                                                        <input
                                                          type="radio"
                                                          name={`time_slot_${addon.id}_${date}`}
                                                          value={slot.time_slot}
                                                          data-timeslot-id={
                                                            slot.id
                                                          }
                                                          checked={
                                                            addon.selectedDates?.find(
                                                              (d) =>
                                                                d.date === date
                                                            )?.timeSlot ===
                                                            slot.time_slot
                                                          }
                                                          onChange={(e) =>
                                                            handleSlotChange(
                                                              addon.id,
                                                              e,
                                                              date
                                                            )
                                                          }
                                                          className="h-4 w-4 border border-gray-300 rounded-full checked:bg-[#fbe899] checked:border-[#fbe899] focus:outline-none mr-3"
                                                        />
                                                        <span className="text-l-orange text-sm">
                                                          {slot.time_slot}
                                                        </span>
                                                      </label>
                                                    )
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
    </div>
  );
}
