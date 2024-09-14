import React, { useEffect, useRef, useState } from "react";
import BackButton from "../BackButton";
import CaretIcon from "../Icons/CaretIcon";
import applePay from "../../assets/applePay.png";
import bankCard from "../../assets/bank.svg";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup";
import moment from "../../../node_modules/moment/moment";
import CounterDownTimer from "../CounterDownTimer";
import Loader from "../Loader";

export default function Pay({
  handlePay = () => {},
  payAmount,
  handlePreviousStep,
  paymentProcess,
  purchaseData,
  setPayAmount,
  setSelectedTicket,
  setStep,
  paymentUrl,
  timer,
  percent,
  isPopupOpen,
  closePopup,
  loading,
  applePaymentUrl,
  setCloseToStep0,
  handleClosePay,
}) {
  const navigate = useNavigate();
  const cvcRef = useRef();
  const expiryRef = useRef();
  const [payFormData, setPayFormData] = useState({
    card: "",
  });

  const handleFormData = (data) => {
    const handleSpacer = (text, spacer = " ", limiter = 4) => {
      let formattedText = text.replace(/[^0-9\s]/g, "");
      formattedText = formattedText.split(" ").join("");
      if (formattedText.length > 0) {
        formattedText = formattedText
          .match(new RegExp(`.{1,${limiter}}`, "g"))
          .join(spacer);
      }
      return formattedText;
    };

    // mutable values
    let { name, value } = data;

    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      if (value.length > 50) {
        alert("Too many characters.");
        return;
      }
    } else if (name === "card") {
      value = handleSpacer(value);
      if (value.length > 24) {
        expiryRef.current.focus();
        handleFormData(expiryRef.current);
        return;
      }
    } else if (name === "expiry") {
      value = handleSpacer(value, undefined, 2);
      if (value.length > 5) {
        cvcRef.current.focus();
        handleFormData(cvcRef.current);
        return;
      }
    } else if (name === "cvc") {
      value = value.replace(/[^0-9]/g, "");

      if (String(value.length) > 3) {
        return;
      }
    }

    setPayFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePay();
    alert("process payment");
    navigate("/ticket");
  };

  return (
    <div className="pay flex flex-col min-h-full   sm:px-6 sm:py-12   h-[100vh] sm:h-auto pb-0  ">
      <div className="flex-1 flex-col sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6   h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full xs:max-w-xs">
          {/* <span onClick={handlePreviousStep}>
            <BackButton />
          </span> */}
          <div className="w-full flex justify-end">
            <button className="text-[20px] font-bold" onClick={handleClosePay}>
              &#x2715;
            </button>
          </div>

          <h2 className="mt-10 mb-[2rem] text-left w-full sm:w-full  text-4xl leading-9 tracking-tight text-primary-orange">
            Select your method of payment
          </h2>
        </div>
        <CounterDownTimer timer={timer} percent={percent} />
        <div
          className={` mx-5 summaryCard rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500   bg-[#FFF7E0] mt-8 mb-0   `}
        >
          <div className={`flex items-center content-between w-full mb-3 mt-3`}>
            <p className="text-[14px] capitalize font-medium text-left flex-1 text-primary-orange">
              Invoice number
            </p>
            {/* #note: font-medium in design */}
            <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
              {purchaseData.purchase_number}
            </p>
          </div>
          <div className={`flex items-center content-between w-full`}>
            <p className="text-[14px] capitalize font-medium text-left flex-1 text-primary-orange">
              Total
            </p>
            {/* #note: font-medium in design */}
            <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
              {/*  moment(new Date()).format("DD/MM/YYYY")    */}
              AED {purchaseData.total}
            </p>
          </div>
        </div>
        {/* <img
            src={applePay}
            alt="applePay"
            // #note: apple pay should have separate handling
            onClick={handlePay}
            className="w-full object-contain my-10"
          /> */}
        <div className="my-8 ">
          {/* {applePaymentUrl && (
            <iframe
              title="appleFrame"
              src={applePaymentUrl}
              width="100%"
              height="60px"
              frameBorder="0"
              allow="payment *"
            />
          )} */}
          {/* <iframe
            className="mt-6"
            title="creditCardFrame"
            src={paymentUrl}
            width="100%"
            height="560px"
            frameBorder="0"
            allow="payment *"
          /> */}
          {/* <p className="text-base font-medium   text-left text-[#707072] my-5">
              Pay with bank card
            </p>
            <div className="relative" style={{ margin: 0 }}>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder=" "
                value={payFormData.name}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  payFormData.name?.length
                    ? "border-formDarkGray border-solid border-2"
                    : "border-[#b7b7b7]  border-solid border-2"
                } outline-none ring-transparent w-full rounded-lg   px-[28px] py-[16px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                  payFormData.name
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Name
              </label>
            </div>
            <div className="relative" style={{ margin: 0 }}>
              <input
                id="card"
                name="card"
                type="text"
                required
                placeholder=" "
                value={payFormData.card}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  payFormData.card?.length
                    ? "border-formDarkGray border-solid border-2"
                    : "border-[#b7b7b7]  border-solid border-2"
                } outline-none ring-transparent w-full rounded-lg   px-[4rem] py-[16px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <img
                src={bankCard}
                alt="bankcard"
                className={`absolute left-[1.8rem] top-[1.8rem]  `}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[4rem]  text-formSubGray transition-all duration-300 ${
                  payFormData.card
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Card number
              </label>
            </div>
            <div className="grid grid-flow-col auto-rows-max gap-2 ">
              <div className="relative m-0 w-full">
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  ref={expiryRef}
                  required
                  placeholder=" "
                  value={payFormData.expiry}
                  onChange={(e) => handleFormData(e.target)}
                  className={`border ${
                    payFormData.expiry?.length
                      ? "border-formDarkGray border-solid border-2"
                      : "border-[#b7b7b7]  border-solid border-2"
                  } outline-none ring-transparent w-full  rounded-lg   px-[28px] py-[16px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                />
                <label
                  htmlFor="email"
                  className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                    payFormData.expiry
                      ? "text-xs top-[1rem]"
                      : "text-md top-[1.5rem]"
                  }`}
                >
                  MM YY
                </label>
              </div>
              <div className="relative m-0 w-full">
                <input
                  id="cvc"
                  name="cvc"
                  ref={cvcRef}
                  type="password"
                  maxLength="3"
                  required
                  placeholder=" "
                  value={payFormData.cvc}
                  onChange={(e) => handleFormData(e.target)}
                  className={`border ${
                    payFormData.cvc?.length
                      ? "border-formDarkGray border-solid border-2"
                      : "border-[#b7b7b7]  border-solid border-2"
                  } outline-none ring-transparent w-full flex-[0.4]   rounded-lg   px-[28px] py-[16px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                />
                <label
                  htmlFor="email"
                  className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                    payFormData.cvc
                      ? "text-xs top-[1rem]  left-[1.5rem]"
                      : "text-md top-[1.5rem] "
                  }`}
                >
                  CVC
                </label>
              </div>
            </div> */}
        </div>
        <div className="flex w-full   sticky sm:static bottom-0 sm:bottom-auto   ">
          <button
            onClick={paymentProcess}
            disabled={
              loading
              //  ||
              // !payFormData.name?.length ||
              // !payFormData.card?.length ||
              // !payFormData.cvc?.length ||
              // !payFormData.expiry?.length
            }
            className={`flex sm:my-10 h-16 sm:rounded-lg w-full justify-center items-center ${
              !loading && "cursor-pointer"
            }   overflow-hidden  px-[1rem] py-[2rem] text-base px-[28px] py-[16px] text-center bg-primary-orange font-medium text-white shadow-sm focus-visible:outline`}
          >
            Pay now{loading && <Loader />}
          </button>
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
      {/* <Popup isOpen={isPopupOpen} width="w-1/3">
        <h2 className="text-xl font-bold mb-2 text-center">Session Expired</h2>
        <p className="text-center">
          Your Ticket booking session has been expired.
        </p>
        <div
          onClick={closePopup}
          className="flex justify-between items-center text-white bg-black px-[1rem] py-[2rem] cursor-pointer mt-12"
        >
          Start new Booking
          <CaretIcon />
        </div>
      </Popup> */}
      {/* <Popup isOpen={closeToStep0} width="w-1/4">
        <h2 className="text-xl font-bold mb-2 text-center">Cancel purchase</h2>
        <p className="text-center">This will restart booking.</p>
        <div className="flex gap-4 justify-center">
          <div
            onClick={() => setCloseToStep0(false)}
            className="w-[10rem] flex justify-between items-center text-white bg-black px-[1rem] py-[2rem] cursor-pointer mt-12"
          >
            Continue
          </div>
          <div
            onClick={() => setStep(0)}
            className="w-[10rem] flex justify-between items-center text-white bg-black px-[1rem] py-[2rem] cursor-pointer mt-12"
          >
            Cancel booking
          </div>
        </div>
      </Popup> */}
    </div>
  );
}
