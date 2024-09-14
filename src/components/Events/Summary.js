import React, { useEffect, useRef, useState } from "react";
import Popup from "../Popup";
import BackButton from "../BackButton";
import CaretIcon from "../Icons/CaretIcon";
import CounterDownTimer from "../CounterDownTimer";
import Loader from "../Loader";

const noop = () => {
  alert("function called.");
};

const DataLine = ({
  leftData = "LEFTDATA",
  rightData = "RIGHTDATA",
  classes = "mb-3",
}) => (
  <>
    {rightData && (
      <div className={`flex items-top content-between w-full  ${classes}`}>
        <p className="text-xs capitalize font-medium text-left flex-1 text-primary-orange">
          {leftData}
        </p>
        {/* #note: font-medium in design */}
        <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
          {rightData}
        </p>
      </div>
    )}
  </>
);

export default function Summary({
  coupon,
  couponApplied = false,
  payAmount,
  setCoupon = noop,
  handlePay = noop,
  handleNextStep,
  selectedTicket,
  addonList,
  orderData = {
    orderNumber: "XXVE1231",
    orderDate: "12/12/2023",
    ticketInfo: {
      date: "12 Auguest 2023",
      "Unit price": "AED 15 ",
      Quantity: "2",
      Price: "AED 30 ",
    },
    addonInfo: {
      "Unit price": "AED 5 ",
      Quantity: "2",
      Price: "AED 10 ",
    },
    taxPercentage: 5,
    tax: "AED 10",
    discount: "AED 10",
  },
  handlePreviousStep,
  applyCoupon = noop,
  setStep = noop,
  setSelectedTicket,
  setPayAmount,
  timer,
  percent,
  isPopupOpen,
  deductedValue,
  loading,
  closePopup,
  setCloseToStep0,
}) {
  useEffect(() => {
    window.analytics.track("Cart Viewed", {
      cart_id: Math.random(),
      products: [
        {
          name: selectedTicket.package_name,
          price: payAmount,
        },
      ],
    });
  }, []);

  return (
    <div className="addons flex flex-col min-h-full   sm:px-6 sm:py-12   h-[100vh] sm:h-auto pb-0  ">
      <div className="flex flex-2 sm:flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6   h-min-[100vh] sm:h-auto pb-0">
        <span onClick={handlePreviousStep}>
          <BackButton />
        </span>

        {/* <div className="flex justify-end">
          <button
            className="text-[20px] font-bold"
            onClick={() => setCloseToStep0(true)}
          >
            &#x2715;
          </button>
        </div> */}
        <h2 className="mt-10 mb-[2rem] text-left w-full sm:w-full  text-4xl leading-9 tracking-tight text-primary-orange">
          Your order summary
        </h2>
      </div>
      {/*
                Time to complete - COUNTDOWN
            */}
      {/* <CounterDownTimer timer={timer} percent={percent} /> */}

      <div className="flex flex-1  flex-col px-6 pt-5 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6   h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          {/* <DataLine
            leftData={"Order number"}
            rightData={orderData.orderNumber}
          />
          <DataLine leftData={"Order date"} rightData={orderData.orderDate} /> */}
          {orderData.ticketInfo.map((ticket) => (
            <div
              className={`summaryCard rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500   bg-[#FFF7E0] mt-5 `}
            >
              {/* #note: font-medium in design */}
              <p className="text-base font-semibold text-left text-primary-orange mb-3  ">
                {selectedTicket.package_name}
              </p>
              {Object.keys(ticket).map((key) => (
                <DataLine key={key} leftData={key} rightData={ticket[key]} />
              ))}
            </div>
          ))}
          {orderData.addonInfo.map((addon) => (
            <div
              className={`summaryCard rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500    bg-[#FFF7E0] my-5   `}
            >
              {/* #note: font-medium in design */}
              <p className="text-base font-semibold text-left text-primary-orange mb-3  ">
                Add-on{" "}
              </p>
              {Object.keys(addon).map((key) => (
                <DataLine key={key} leftData={key} rightData={addon[key]} />
              ))}
            </div>
          ))}
          {/* <DataLine
            leftData={`Tax (${orderData.taxPercentage}%)`}
            rightData={orderData.tax}
          />
          <DataLine leftData={`Discount`} rightData={orderData.discount} /> */}
          {/* COUPON CODE  */}
          <div className="relative w-full">
            <input
              id="coupon"
              name="coupon"
              placeholder="Coupon code"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className={`  focus:outline-primary-orange w-full h-14 mt-5 text-sm text-left text-[#707072]    px-5 rounded-lg border border-[#b7b7b7]`}
            />{" "}
            <label
              onClick={applyCoupon}
              // htmlFor="coupon"
              //   className={`border outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px]  flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              className="absolute right-[2rem] top-[2.5rem] text-xs font-medium text-left text-[#111] transition-all duration-300
                top-[2.5rem]
               cursor-pointer"
            >
              Apply
            </label>
            <span className="mb-[10vh]">
              {couponApplied.show && (
                <p
                  className={`w-[100%] text-sm text-left ml-[1rem] mt-[.5rem] ${
                    couponApplied.success ? "text-green" : "text-red"
                  }`}
                >
                  {couponApplied.success
                    ? `${deductedValue} AED OFF`
                    : "Invalid / Expired Coupon"}
                </p>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="sm:mx-auto  w-full sm:w-full sm:max-w-md sticky sm:static bottom-0 sm:bottom-auto mt-6">
        {/* <div className="flex justify-between items-center text-white bg-black p-[1rem] text-[14px] border-b-[2px] border-white">
          <div>Total</div>
          <div>{payAmount} AED</div>
        </div> */}
        <div
          onClick={handlePay}
          // onClick={handleNextStep}
          className={`relative overflow-hidden flex justify-between items-center text-screen-light bg-primary-orange px-[1rem] py-[2rem] ${
            !loading && "cursor-pointer"
          }`}
        >
          <div className="w-full flex justify-between">
            <span>Total Cost: AED {payAmount}</span>
            <span className="mr-8">Pay now</span>
          </div>
          {loading && <Loader />}
          <CaretIcon />
        </div>
      </div>

      <Popup isOpen={isPopupOpen} width="w-[90vw] sm:w-[50vw]">
        <h2 className="text-xl font-bold mb-2 text-center">Session Expired</h2>
        <p className="text-center m-3">
          Your Ticket booking session has been expired.
        </p>
        <div className="flex gap-0 sm:gap-2 justify-center flex-col  ">
          <div
            onClick={closePopup}
            // className="flex justify-between items-center text-white bg-black px-[1rem] py-[2rem] cursor-pointer mt-12"
            className="w-full text-center  flex   justify-center items-center text-white bg-black px-[1rem] py-[1rem] cursor-pointer mt-2"
          >
            Start new Booking
            <CaretIcon className="mx-2" />
          </div>
        </div>
      </Popup>
    </div>
  );
}
