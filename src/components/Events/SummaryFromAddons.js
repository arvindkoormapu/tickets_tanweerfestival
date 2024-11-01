import React, { useEffect } from "react";
import Popup from "../Popup";
import BackButton from "../BackButton";
import CaretIcon from "../Icons/CaretIcon";
import Loader from "../Loader";
import Logo from "../../logo_dark.png";

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
        <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
          {rightData}
        </p>
      </div>
    )}
  </>
);

export default function Summary({
  payAmount,
  handleNextStep,
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
  isPopupOpen,
  loading,
  closePopup,
}) {

  return (
    <div className="addons flex flex-col min-h-full   sm:px-6 lg:px-8 h-[100vh] sm:h-auto pb-0">
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

      <div className="flex flex-1 flex-col px-6 sm:mx-auto sm:w-full h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className="">
          <div className="flex justify-between items-center">
            <h2 className="text-[26px] mt-[1rem] mb-[1rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
              Your order summary
            </h2>
          </div>

          <div className="">
            {orderData.addonInfo.map((addon, i) => (
              <div
                key={i}
                className={`summaryCard rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500    bg-[#FFF7E0] my-5   `}
              >
                <p className="text-base font-semibold text-left text-primary-orange mb-3">
                  Add-on{" "}
                </p>
                {Object.keys(addon).map((key) => (
                  <DataLine key={key} leftData={key} rightData={addon[key]} />
                ))}
              </div>
            ))}

            
          </div>
        </div>
      </div>
      <div className="w-full mx-auto sticky bottom-0 mt-6">
        <div
          onClick={handleNextStep}
          className={`relative sm:px-6 overflow-hidden flex justify-between items-center text-screen-light bg-primary-orange px-[1rem] py-[2rem] ${
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