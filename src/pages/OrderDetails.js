import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import CaretIcon from "../components/Icons/CaretIcon";
import axios from "axios";

export default function OrderDetails() {
  const [status, setStatus] = useState("success");
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("lastAnalyticsData");
        if (storedData) {
          const getPurchaseDetails = JSON.parse(storedData);
          setOrderDetails(getPurchaseDetails);
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}payment/magnati/mpg/success.php?order_ID=${getPurchaseDetails.purchase_number}`,
          );
          console.log("data", response.data);
          setStatus("success");
        } else {
          console.log("No data found in localStorage");
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="ticket flex min-h-full">
      <div className="flex flex-1 flex-col  sm:px-3 sm:py-6 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full">
          <Link to="/profile">
            <BackButton />
          </Link>
          <div className="flex justify-center items-start w-full">
            {status === "success" ? (
              <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-[#07bc0c]">
                <svg
                  className="w-8 h-8 text-[#07bc0c]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : status === "failed" ? (
              <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-[#ca2929]">
                <svg
                  className="w-8 h-8 text-[#ca2929]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col justify-center items-center mt-10 w-auto">
            <h2 className="text-start text-[27px] leading-9 tracking-tight text-primary-orange">
              Ticket &nbsp; #{orderDetails.purchase_number}
            </h2>
            <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
              {orderDetails.ticket_name}
            </h5>
            <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
              Date: &nbsp; {orderDetails.selected_dates}
            </h5>
            <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
              Quantity: &nbsp; {orderDetails.qty}
            </h5>
            <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
              Total: &nbsp; AED {orderDetails.total}
            </h5>
          </div>
        </div>
        <div className="static bottom-0 sm:mx-auto sm:w-full w-auto mt-4">
          <div className="flex flex-col w-full sm:w-auto">
            <Link to="/" className="font-semibold leading-6 text-screen-light ">
              <button
                className={`flex w-full justify-between items-center  bg-primary-orange  px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-medium text-white shadow-sm focus-visible:outline`}
              >
                <div>Back to home</div>
                <CaretIcon width={"14px"} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
