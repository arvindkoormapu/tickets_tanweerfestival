import { useEffect, useState } from "react";
import { monthNames } from "../../constants";
import BackButton from "../BackButton";
import CaretIcon from "../Icons/CaretIcon";
import Loader from "../Loader";
import Logo from "../../logo_dark.png";

export default function DatePicker({
  qty,
  handleNextStep,
  selectedDate,
  inventoryList,
  selectedTicket,
  setStep,
  dates = [],
  setDateList,
  handlePreviousStep,
  payAmount,
  loading,
}) {
  const dataFromDate = (value) => {
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return { day, month, year };
  };

  const handleSelectDate = (date) => {
    if (loading) {
      return;
    }
    let result;
    Object.keys(inventoryList).map((key, value) => {
      if (key === date.value) {
        result = inventoryList[key];
      }
    });
    if (result < qty) {
      return;
    }
    const tempSelectedDates = dates.map((dt) => {
      if (dt.id === date.id) {
        dt.selected = !dt.selected;
      }
      return dt;
    });
    setDateList(tempSelectedDates);
  };

  const qtyCheck = (date) => {
    let result;
    Object.keys(inventoryList).map((key, value) => {
      if (key === date.value) {
        result = inventoryList[key];
      }
    });
    return { isAvailable: selectedTicket.qty > result, qty: result };
  };

  const soldOutCheck = (date) => {
    let result;
    Object.keys(inventoryList).map((key, value) => {
      if (key === date.value) {
        result = inventoryList[key];
      }
    });
    return result === 0;
  };

  return (
    <div className="tickets flex flex-col min-h-full   sm:px-6 lg:px-8 h-[100vh] sm:h-auto pb-0 ">
      <div className="flex flex-row justify-between items-center shadow-[0_4px_4px_-1px_rgba(0,0,0,0.1)] p-6 sm:px-6 sm:py-6 mx-auto w-full sticky top-0 bg-[#fff] z-10">
        <span onClick={handlePreviousStep}>
          <BackButton />
        </span>
        <img
          src={Logo}
          alt="Visa and Mastercard Logos"
          className={`h-[30px] w-[100%] object-contain`}
        />
        <div className="flex"></div>
      </div>
      <div className="flex flex-1 flex-col px-6 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6  h-min-[100vh] sm:h-auto pb-0 justify-start">
        <h2 className="text-[26px] mt-[1rem] mb-[1rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
          Select the dates for your tickets
        </h2>
        {dates &&
          dates.map((date, i) => {
            const { day, month, year } = dataFromDate(date.title);
            return (
              <div
                key={i}
                onClick={() => handleSelectDate(date)}
                className={`date h-[108px] px-5 mb-5  w-full flex items-center justify-between
                                  rounded-lg hover:opacity-95 transition-all duration-500 ${
                                    !loading && "cursor-pointer"
                                  } ${
                  date.selected ? "bg-primary-orange  " : " bg-[#FFF7E0] "
                } `}
              >
                <div
                  className={`text-[18px]  ${
                    date.selected ? "text-[#fbe899]" : "text-primary-orange"
                  }`}
                >
                  DAY {i + 1}
                </div>
                <span
                  className={`text-[18px]  ${
                    date.selected ? "text-[#fbe899]" : "text-primary-orange"
                  }`}
                >
                  {day} {month} {year}
                </span>
                {/* <p
                  className={` text-base font-bold text-left ${
                    date.selected ? "text-[#fbe899]" : "text-primary-orange "
                  }`}
                >
                  {`${month} ${year}`}{" "}
                </p> */}
                <>
                  {soldOutCheck(date) ? (
                    <p className="text-base text-d-orange font-medium text-left">
                      Sold Out
                    </p>
                  ) : (
                    <>
                      {qtyCheck(date).isAvailable ? (
                        <small className="text-base text-center text-d-orange font-medium">{`Only ${
                          qtyCheck(date).qty
                        } available`}</small>
                      ) : (
                        <>
                          {!date.selected ? (
                            <div className="w-6 h-6 rounded-lg border border-primary-orange"></div>
                          ) : (
                            <svg
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              preserveAspectRatio="none"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width={23}
                                height={23}
                                rx="7.5"
                                fill="white"
                                stroke="white"
                              />
                              <path
                                d="M5 11.435L9.753 16.188L18.939 7"
                                stroke="#D27322"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              </div>
            );
          })}
      </div>
      <div className="w-full mx-auto sticky bottom-0">
        {/* <div className="flex justify-between items-center text-white bg-black p-[1rem] text-[14px] border-b-[2px] border-white">
          <div>Total</div>
          <div>{payAmount} AED</div>
        </div> */}
        <div
          onClick={() =>
            dates.filter((date) => date.selected).length && handleNextStep()
          }
          className={`flex justify-between items-center sm:px-6 ${
            dates.filter((date) => date.selected).length
              ? "bg-primary-orange"
              : "bg-primary-orange opacity-[75%]"
          } relative overflow-hidden text-white  px-[1rem] py-[2rem] ${
            !loading &&
            dates.filter((date) => date.selected).length &&
            "cursor-pointer"
          } `}
        >
          <div className="w-full flex justify-between text-screen-light">
            <span>Total Cost: AED {payAmount}</span>
            <span className="mr-8">
              {dates.filter((date) => date.selected).length
                ? "Continue"
                : "Select your dates"}
            </span>
          </div>
          {loading && <Loader />}
          <CaretIcon />
        </div>
      </div>
    </div>
  );
}
