import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import CaretIcon from "../components/Icons/CaretIcon";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import qrBg from "../assets/qrBg.png";
// import qr from "../assets/qr.png";
import QRCode from "react-qr-code";
import { fetchClient } from "../AxiosConfig";
import moment from "../../node_modules/moment/moment";
import ticketTopLog from "../assets/ticket-top.png";
import ticketBottom from "../assets/ticket-bottom.png";
import { title } from "../constants/index";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const noop = () => {
  alert("function called.");
};

const DataCol = ({
  topData = "Loading...",
  bottomData = "Loading...",
  classes = "mb-0",
  type = "singleRow",
  id = null,
}) => (
  <div className={`flex flex-row items-center w-full ${classes}`}>
    {type !== "list" || (type === "list" && id === 0) ? (
      <p className="text-xs font-medium text-left text-white flex-shrink-0 w-1/5">
        {topData}
      </p>
    ) : null}
    {/* #note: font-medium in design */}
    <p className="capitalize w-full text-xs text-left text-[#fbe899]">
      {bottomData}
    </p>
  </div>
);

export default function Ticket({
  ticket = {
    date: undefined,
    qrImage: undefined,
    days: undefined,
    price: undefined,
    quantity: undefined,
    location: undefined,
    addon: [
      "Add on 1 Long title for this",
      "Add on 2 Long title for this",
      "Add on 3 Long title for this",
      "Add on 4 Long title for this",
      "Add on 5 Long title for this",
    ],
  },
  downloadTicket = noop,
}) {
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseList, setPurchaseList] = useState();
  const [calendarDate, setCalendarDate] = useState("2024-11-24");
  const [priceTotal, setPriceTotal] = useState(0);

  const params = useParams();
  const location = useLocation(); // To access the query parameters from the URL

  useEffect(() => {
    setSpinner(true);
    window.analytics.page();
    document.title = `Ticket - ${title}`;
    const getOrderDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const resultIndicator = queryParams.get("resultIndicator");
      if (resultIndicator) {
        await axios.get(
          `${process.env.REACT_APP_BASE_URL}payment/magnati/mpg/success.php?order_ID=${params.purchase_number}`
        );
      }
      setTimeout(async () => {
        const formData = new FormData();
        formData.append("action", "orderHistory");
        formData.append("purchase_number", params.purchase_number);
        const data = await fetchClient(formData, "POST", "");
        if (data.data.length) {
          setOrderDetails(data.data);

          // Calculate the number of days
          const numberOfDays =
            data.data[0]?.items?.packages[0].date.length || 1;

          // Calculate the number of tickets
          // const numberOfTickets = parseInt(data.data[0]?.ticketData[0].qty) || 1;

          // Calculate the price total
          const priceTotal = data.data[0]?.ticketData[0].price * numberOfDays;

          console.log(numberOfDays);
          //  console.log(numberOfTickets);
          console.log(priceTotal);

          setPriceTotal(priceTotal);

          if (data.data[0].items.packages[0].date.length) {
            const dates = data.data[0].items.packages[0].date.map((dt) =>
              moment(dt)
            );
            const minDate = moment.min(dates).format("YYYY-MM-DD");
            setCalendarDate(minDate);
          }
          window.analytics.track("Order Completed", {
            total: data.data[0].total,
            checkout_id: data.data[0].purchase_number,
            order_id: data.data[0].order_number,
            currency: "AED",
            products: [
              {
                name: data.data[0].ticketData[0].ticket_name,
                price: data.data[0].ticketData[0].price,
              },
            ],
          });

          // const user = JSON.parse(localStorage.getItem("ajs_user_traits"));
          // Push order data to the GTM data layer
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            // email: user.email,
            ecommerce: {
              order_id: data.data[0].order_number,
              total: data.data[0].total,
              currency: "AED",
              items: {
                tickets: {
                  name: data.data[0].ticketData[0].ticket_name,
                  price: data.data[0].ticketData[0].price,
                  quantity: data.data[0].ticketData[0].qty,
                },
                addons: data.data[0].addonData.map((product) => ({
                  ticket_name: product.name,
                  price: product.price,
                })),
              },
            },
          });
          setLoading(false);
        } else {
          const formData = new FormData();
          formData.append("action", "purchaseListing");
          const data = await fetchClient(formData, "POST", "");
          if (data) {
            const tempData = data.data.find(
              (purchase) => purchase.purchase_number === params.purchase_number
            );
            setPurchaseList(tempData);
          }
          setLoading(false);
        }
        setSpinner(false);
      }, 1000);
    };
    sessionStorage.clear();
    getOrderDetails();
  }, []);

  // const statusCheck = (statusValue) => {
  //   if (statusValue === "0") return "Failed";
  //   if (statusValue === "1") return "Success";
  //   if (!statusValue || statusValue === "2") return "Pending";
  // };

  // Function to format the date
  const formatSlots = (slots) => {
    return slots
      .map((slot) => {
        const date = new Date(slot.event_date);
        const formattedDate = `${date.getDate()} ${date.toLocaleString(
          "default",
          { month: "short" }
        )}`; // e.g., "22 Nov"

        // Only add the time if it exists, without leading space
        return slot.slot_time
          ? `${formattedDate} : ${slot.slot_time}`
          : formattedDate; // e.g., "22 Nov : 12:00 PM" or "22 Nov"
      })
      .join(", "); // Join the formatted strings with a comma
  };

  const handleDownloadPdf = async (path, name) => {
    const pdfUrl = path;

    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (spinner) {
    return (
      <div className="flex justify-center items-center h-[200px]">
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
          {orderDetails.length > 0 && (
            <div className="flex flex-col justify-start items-start mt-10 w-auto">
              <h2 className="text-start text-[27px] leading-9 tracking-tight text-primary-orange">
                Ticket &nbsp; #{orderDetails[0].order_number}
              </h2>
              <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
                Date: &nbsp; {orderDetails[0].items.packages[0].date.join(", ")}
              </h5>
              <div className="flex flex-row justify-between items-start mt-0 w-full">
                {/* <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
                  {orderDetails[0].ticketData[0].ticket_name}
                </h5> */}
                <h5 className="text-start text-[16px] leading-9 tracking-tight text-primary-orange">
                  Total: &nbsp; AED {orderDetails[0].total}
                </h5>
              </div>
            </div>
          )}
          {/* TICKET IMAGE PART */}
          {orderDetails.length > 0 || loading ? (
            <>
              <div className="ticketInfo w-full top-0 bg-d-orange p-5">
                {orderDetails.map((order) =>
                  order.ticketData.qrcodes.map((qrcode, index) => (
                    <div key={qrcode.id}>
                      <h5 className="text-xs font-medium text-left text-white">
                        Ticket {index + 1} of {order.ticketData.qrcodes.length}
                      </h5>
                      <div className="flex flex-row items-center">
                        <div className="pr-5">
                          <QRCode
                            size={100}
                            className="h-auto max-w-full rounded-[4px] p-2 bg-white"
                            value={qrcode.qrcode}
                            viewBox={`0 0 100 100`}
                          />
                        </div>
                        <div className="w-full flex flex-col items-start justify-between">
                          <DataCol
                            topData={"Ticket"}
                            bottomData={order.ticketData[0].ticket_name}
                          />
                          <button
                            className="bg-blue-500 text-xs text-white font-bold mt-2 px-4 py-1 rounded hover:bg-blue-700 transition duration-200 border border-blue-500"
                            onClick={() =>
                              handleDownloadPdf(
                                qrcode.pdf_path,
                                order.ticketData[0].ticket_name
                              )
                            }
                          >
                            Download Ticket PDF
                          </button>
                          {/*  <DataCol
                            topData={"Date"}
                            bottomData={order.items.packages[0].date.join(", ")}
                          />
                          <DataCol
                            topData={"Price"}
                            bottomData={"AED " + order.total}
                          /> */}
                        </div>
                      </div>
                      {/* Divider */}
                      {index < order.ticketData.qrcodes.length - 1 && (
                        <div className="border-b border-white my-4" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="my-12">
              {purchaseList ? (
                <>
                  <h2 className="text-center text-[23px] leading-9 tracking-tight text-gray-900">
                    Ticket &nbsp; #{purchaseList.purchase_number}
                  </h2>
                  <h2 className="text-center mt-4 text-[28px] leading-9 tracking-tight text-gray-900">
                    Sorry, your Payment has failed
                  </h2>
                  <p className="text-center text-[22px] mt-4 leading-9 tracking-tight text-gray-900">
                    There seems to be an issue processing your payment. Please
                    try again.
                  </p>
                  <p className="text-center text-[16px] mt-4 leading-7 tracking-tight text-gray-900">
                    If the problem persists, please contact our payments team on
                    the below email, making sure to mention the below payment
                    reference.
                  </p>
                  <p className="text-center text-[16px] tracking-tight text-gray-900">
                    Thank you.
                  </p>
                  <a
                    href="mailto:payments@tanweerfestival.com"
                    className={`w-full justify-between block text-center items-center mb-[1px] mt-4  bg-black    px-[1rem] py-[1rem]  px-[28px] py-[16px] text-base	 font-medium text-white shadow-sm focus-visible:outline`}
                  >
                    payments@tanweerfestival.com
                  </a>
                  <table className="text-black mt-6 m-auto w-full mt-12 text-center">
                    <tr>
                      <th className="border border-zinc-200	 p-[10px]">
                        Payment Reference
                      </th>
                      <th className="hidden border border-zinc-200	 p-[10px]">
                        Status
                      </th>
                      <th className="hidden border border-zinc-200	 p-[10px]">
                        Time
                      </th>
                    </tr>
                    {purchaseList.transactions.map((trans) => (
                      <tr>
                        <td className="border border-zinc-200	 p-[10px]">
                          {trans.payment_ref}
                        </td>
                        <td className="hidden border border-zinc-200	 p-[10px]">
                          Success
                        </td>
                        <td className="hidden border border-zinc-200	 p-[10px]">
                          {trans.transaction_start_time}
                        </td>
                      </tr>
                    ))}
                  </table>
                </>
              ) : (
                <h2 className="text-center mt-4 text-[28px] leading-9 tracking-tight text-gray-900">
                  Sorry, but the ticket belongs to a different user or you do
                  not have permission to access it.
                </h2>
              )}
            </div>
          )}
          {orderDetails.length > 0 && orderDetails[0].addonData.length > 0 && (
            <>
              <div className="flex justify-start items-center mt-10 gap-4 w-auto">
                <h2 className="text-start text-[27px] leading-9 tracking-tight text-primary-orange">
                  Addon
                </h2>
              </div>
              {orderDetails[0].addonData.map((elm, i) => (
                <div className="mt-4">
                  <div className="ticketInfo w-full top-0 bg-d-orange p-5">
                    <div className="flex flex-row items-center">
                      <div className="pr-5">
                        <QRCode
                          size={120}
                          className="h-auto max-w-full rounded-[4px] p-2 bg-white"
                          value={elm.qrcodes.qrcode_image_path}
                          viewBox={`0 0 100 100`}
                        />
                      </div>
                      <div className="w-full flex flex-col items-start justify-between">
                        <DataCol topData={"Ticket"} bottomData={elm.name} />
                        <DataCol
                          topData={"Date"}
                          bottomData={formatSlots(elm.slots)}
                        />
                        <DataCol topData={"Quantity"} bottomData={elm.qty} />
                        <DataCol
                          topData={"Price"}
                          bottomData={"AED " + elm.price}
                        />
                        <button
                          className="bg-blue-500 text-xs text-white font-bold mt-2 px-4 py-1 rounded hover:bg-blue-700 transition duration-200 border border-blue-500"
                          onClick={() =>
                            handleDownloadPdf(elm.qrcodes.pdf_path, elm.name)
                          }
                        >
                          Download Ticket PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="static bottom-0 sm:mx-auto sm:w-full w-auto mt-4">
          <div className="flex flex-col w-full sm:w-auto">
            {orderDetails.length > 0 && (
              <div className="flex flex-col justify-center items-center mb-4 w-full sm:w-auto">
                <AddToCalendarButton
                  name="Tanweer Festival"
                  options={["Apple", "Google"]}
                  images={[
                    "https://bo.discovershurooq.ae/tanweer/assets/img/og.jpg",
                  ]}
                  description={`${orderDetails[0].ticketData[0].ticket_name} - #${orderDetails[0].order_number} - Entry Ticket for ${orderDetails[0].ticketData[0].qty} People.`}
                  location="Mleiha, Sharjah, United Arab Emirates"
                  startDate={calendarDate}
                  endDate={"2024-11-24"}
                  timeZone="Asia/Dubai"
                  iCalFileName="TanweerFestival"
                  hideCheckmark={true}
                  hideIconButton={true}
                  hideBackground={true}
                  hideBranding={true}
                  styleLight="--box-shadow: none;"
                  styleDark="--box-shadow: none;"
                ></AddToCalendarButton>
              </div>
            )}
            {/* <button
              onClick={downloadTicket}
              className={`flex w-full justify-between items-center mb-[1px]   bg-black    px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-medium text-white shadow-sm focus-visible:outline`}
            >
              Download Ticket
              <div className="rotate-90">
                <CaretIcon width={"14px"} />
              </div>
            </button> */}
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
