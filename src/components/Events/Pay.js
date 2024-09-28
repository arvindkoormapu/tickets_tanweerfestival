import React, { useCallback, useEffect, useState, useRef } from "react";
import CaretIcon from "../Icons/CaretIcon";
import Popup from "../Popup";
import CounterDownTimer from "../CounterDownTimer";
import moment from "moment-timezone";
import CryptoJS from "crypto-js";
import { fetchClient } from "../../AxiosConfig";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";

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
  const [status, setStatus] = useState('pending');
  const [checkout, setCheckout] = useState(null);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [formData, setFormData] = useState({
    hash_algorithm: "HMACSHA256",
    checkoutoption: "combinedpage",
    language: "en_US",
    hashExtended: "",
    mobileMode: true,
    storename: "811187409",
    timezone: "Asia/Dubai",
    txndatetime: "",
    txntype: "sale",
    chargetotal: "",
    authenticateTransaction: true,
    paymentMethod: "m",
    parentUri: `${process.env.REACT_APP_BASE_URL}`,
    oid: "",
    currency: "784",
    responseFailURL: `${process.env.REACT_APP_BASE_URL}payment/magnati/ipg/webhook.php`,
    responseSuccessURL: `${process.env.REACT_APP_BASE_URL}payment/magnati/ipg/webhook.php`,
    transactionNotificationURL:
      "https://dev-services.hubdev.wine/api-json/magnati?token=2643ihdfuig",
  });

  useEffect(() => {
    // Function to fetch the status from the PHP endpoint
    const fetchWebhookStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}payment/magnati/ipg/webhook-status.php`); // Adjust your path
        const data = await response.json();
        // setStatus(data.status);
console.log('data from webhook', data)

      } catch (error) {
        console.error('Error fetching webhook status:', error);
      }
    };

    // Poll the webhook status every 3 seconds
    const interval = setInterval(fetchWebhookStatus, 3000);
    // Redirect based on the webhook status
    // if (status === 'success') {
    //   navigate('/success'); // Redirect to success page
    // } else if (status === 'fail') {
    //   navigate('/failure'); // Redirect to failure page
    // }

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    setIsApplePayAvailable(
      (typeof navigator !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")) ||
        /iP(hone|ad|od)/.test(navigator.platform)
    );
  }, []);

  useEffect(() => {
    const newTxnDatetime = moment()
      .tz(formData.timezone)
      .format("YYYY:MM:DD-HH:mm:ss");
    setFormData((prev) => ({
      ...prev,
      txndatetime: newTxnDatetime,
      oid: purchaseData.purchase_number,
      chargetotal: purchaseData.total,
    }));
  }, []);

  // Recalculate hash when txndatetime, oid, or paymentMethod changes
  useEffect(() => {
    if (formData.txndatetime && formData.oid) {
      const messageSignatureContent = Object.keys(formData)
        .filter((key) => key !== "hashExtended")
        .sort()
        .map((key) => formData[key])
        .join("|");

      const messageSignature = CryptoJS.HmacSHA256(
        messageSignatureContent,
        'n+Gs"37vQE'
      );
      const messageSignatureBase64 =
        CryptoJS.enc.Base64.stringify(messageSignature);

      setFormData((prev) => ({
        ...prev,
        hashExtended: messageSignatureBase64,
      }));
    }
  }, [formData.txndatetime, formData.oid]);

  const payOnline = () => {
    if (formData.hashExtended) {
      const form = document.createElement("form");
      form.action = "https://test.ipg-online.com/connect/gateway/processing";
      form.method = "POST";
      form.target = "saleiframe";

      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };

  const handlePayment = (paymentMethod) => {
    if (paymentMethod === "card") {
      handlePayNowClick(window);
      setShowCard(true);
      setShowWallet(false);
    } else if (
      paymentMethod === "applePay" ||
      paymentMethod === "googlePay" ||
      paymentMethod === "samsungPay"
    ) {
      // setFormData((prev) => ({
      //   ...prev,
      //   paymentMethod: paymentMethod,
      // }));
      setShowCard(false);
      setShowWallet(true);
      payOnline(paymentMethod);
    }
  };

  // Working code MPGS - START

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://ap-gateway.mastercard.com/static/checkout/checkout.min.js";
    script.async = true;
    script.onload = async (err) => {
      setCheckout(window.Checkout);
    };
    script.onerror = (error) => {
      console.log("script error: ", error);
    };
    document.head.appendChild(script);
  }, []);

  const configureCheckout = useCallback(
    async (window, session) => {
      if (window?.Checkout) {
        try {
          window?.Checkout?.configure({
            session: {
              id: session,
            },
          });
        } catch (error) {
          console.log("error: ", error);
        }
      }
    },
    [checkout]
  );

  const handleEmbeddedPage = useCallback((window) => {
    if (window?.Checkout) {
      window?.Checkout.showEmbeddedPage("#embed-target");
    }
  }, []);

  const initiateCheckoutSession = async (window) => {
    const url = `${process.env.REACT_APP_BASE_URL}/?action=mpgSession`;
    const formData = new FormData();
    formData.append("returnUrl", `${process.env.REACT_APP_URL}view-ticket/${purchaseData.purchase_number}`);
    formData.append("amount", purchaseData.total);
    formData.append("id", purchaseData.purchase_number);
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData, // No need to set Content-Type when using FormData
      });
  
      const data = await response.json();
      if (data && data.session && data.session.id) {
        await configureCheckout(window, data.session.id);
      } else {
        console.log("Session ID not found in response");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handlePayNowClick = async (window) => {
    await initiateCheckoutSession(window);
    handleEmbeddedPage(window);
  };

  // Working code MPGS - END

  return (
    <div className="pay flex flex-col min-h-full   sm:px-6 sm:py-12   h-[100vh] sm:h-auto pb-0  ">
      <div className="flex-1 flex-col sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6   h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full xs:max-w-xs">
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

        <div className="flex flex-col p-5">
          <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                onChange={() => handlePayment("card")}
                className="text-blue-600"
              />
              <span>Pay with Card</span>
            </label>

            {isApplePayAvailable && (
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple"
                  onChange={() => handlePayment("applePay")}
                  className="text-blue-600"
                />
                <span>Apple Pay</span>
              </label>
            )}

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="google"
                onChange={() => handlePayment("googlePay")}
                className="text-blue-600"
              />
              <span>Google Pay</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="samsung"
                onChange={() => handlePayment("samsungPay")}
                className="text-blue-600"
              />
              <span>Samsung Pay</span>
            </label>
          </div>
        </div>

        <div
          id="embed-target"
          className="mx-5 m-5"
          style={{ display: showCard ? "inline" : "none" }}
        ></div>

        <div style={{ height: "432px" }} className="mx-5 m-5">
          <iframe
            id="saleiframe"
            name="saleiframe"
            style={{
              width: "100%",
              height: "100%",
              display: showWallet ? "inline" : "none",
            }}
            title="Payment Processing Frame"
          ></iframe>
        </div>

        {/* <div className="flex w-full   sticky sm:static bottom-0 sm:bottom-auto   ">
          <button
            // onClick={paymentProcess}
            onClick={() => handlePayNowClick(window)}
            disabled={loading}
            className={`flex sm:my-10 h-16 sm:rounded-lg w-full justify-center items-center ${
              !loading && "cursor-pointer"
            }   overflow-hidden  px-[1rem] py-[2rem] text-base px-[28px] py-[16px] text-center bg-primary-orange font-medium text-white shadow-sm focus-visible:outline`}
          >
            Pay now{loading && <Loader />}
          </button>
        </div> */}
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
