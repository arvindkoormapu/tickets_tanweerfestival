import React, { useEffect, useState } from "react";
import caretRightWhite from "../assets/caret-right-white.svg";
import { Link } from "react-router-dom";
import CaretIcon from "../components/Icons/CaretIcon";
import BackButton from "../components/BackButton";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import { fetchClient } from "../AxiosConfig";
import moment from "../../node_modules/moment/moment";
import { title } from "../constants/index";
import { profileDetails } from "../ProfileApi";
import Logo from "../logo_dark.png";

const DataLine = ({
  leftData = "Loading...",
  rightData = "Loading...",
  classes = "mb-3",
  whiteText = false,
}) =>
  whiteText ? (
    <div className={`flex items-center content-between w-full ${classes}`}>
      <p className={`opacity-50 text-sm text-left text-white flex-1 `}>
        {leftData}
      </p>
      <p className={` text-base font-medium text-left text-white`}>
        {rightData}
      </p>
    </div>
  ) : (
    <div className={`flex items-center content-between w-full ${classes}`}>
      <p
        className={`text-xs font-medium text-left text-primary-orange flex-1  `}
      >
        {leftData}
      </p>
      {/* #note: font-medium in design but semi bold looks closer */}
      <p className={`text-xs font-semibold text-right text-primary-orange `}>
        {rightData}
      </p>
    </div>
  );

export default function Profile({
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

  ticketList = [
    {
      id: "ticket_0",
      title: "Day Pass",
      addons: [],
      date: "1 Sep 2023, Sep 2 2023",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      price: "AED 30",
      qty: 0,
      showMore: false,
      keyPoints: [
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
      ],
    },
    {
      id: "ticket_1",
      title: "Day Pass",
      addons: [],
      date: "Sep 2 2023",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      price: "AED 30",
      qty: 0,
      showMore: false,
      keyPoints: [
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
        "Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Duis leo erat.",
      ],
    },
  ],
}) {
  const [profileData, setProfileData] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [addonsHistory, setAddonsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    // window.analytics.page();
    document.title = `Profile - ${title}`;
    const getprofileDetails = async () => {
      setLoading(true);
      const data = await profileDetails();
      if (data) {
        console.log(data);
        setProfileData(data.data);
      }
      setLoading(false);
    };
    const getOrderHistory = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append("action", "orderHistory");
      const data = await fetchClient(formData, "POST", "");
      if (
        (data.data && "tickets" in data.data) ||
        "purchaseAddons" in data.data
      ) {
        if (data.data.tickets) {
          setOrderHistory(data.data.tickets);
        }
        if (data.data.purchaseAddons) {
          setAddonsHistory(data.data.purchaseAddons);
        }
      }
      setLoading(false);
    };
    getOrderHistory();
    getprofileDetails();
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/signin");
  };

  const handleDownloadAllPDFLinks = async () => {
    try {
      setDownloadProgress(10);

      // Collect all PDF paths
      const allPdfPaths = [];

      // Calculate total items to process
      let totalItems = 0;
      orderHistory.forEach(order => {
        if (order.ticketData && order.ticketData.qrcodes) {
          totalItems += order.ticketData.qrcodes.length;
        }
      });

      addonsHistory.forEach(addon => {
        if (addon.pdf_path) {
          totalItems += 1;
        }
      });

      if (totalItems === 0) {
        alert("No PDF links found!");
        setDownloadProgress(0);
        return;
      }

      setDownloadProgress(30);

      // Collect PDF paths from orderHistory tickets (no delays - instant)
      orderHistory.forEach(order => {
        if (order.ticketData && order.ticketData.qrcodes) {
          order.ticketData.qrcodes.forEach(qrcode => {
            if (qrcode.pdf_path) {
              allPdfPaths.push(qrcode.pdf_path);
            }
          });
        }
      });

      setDownloadProgress(60);

      // Collect PDF paths from addonsHistory (no delays - instant)
      addonsHistory.forEach(addon => {
        if (addon.pdf_path) {
          allPdfPaths.push(addon.pdf_path);
        }
      });

      setDownloadProgress(80);

      // Create text file content
      const textContent = allPdfPaths.join('\n');

      // Create blob and download
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'tanweer-tickets-pdfs.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

      setDownloadProgress(100);

      // Reset progress after a short delay
      setTimeout(() => {
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error downloading PDF links:', error);
      alert('Failed to download PDF links. Please try again.');
      setDownloadProgress(0);
    }
  };

  // Combine orderHistory and addonsHistory for unified pagination
  const combinedHistory = [
    ...orderHistory.map(item => ({ ...item, type: 'ticket' })),
    ...addonsHistory.map(item => ({ ...item, type: 'addon' }))
  ];

  // Calculate pagination values
  const totalPages = Math.ceil(combinedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = combinedHistory.slice(startIndex, endIndex);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderHistory.length, addonsHistory.length]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="addons flex flex-col min-h-full sm:px-6  lg:px-8 h-[100vh] sm:h-auto pb-0">
      <div className="flex flex-row justify-between items-center shadow-[0_4px_4px_-1px_rgba(0,0,0,0.1)] p-6 sm:px-6 sm:py-6 mx-auto w-full sticky top-0 bg-[#fff] z-10">
        <Link to="/">
          <BackButton />
        </Link>
        <img
          src={Logo}
          alt="Visa and Mastercard Logos"
          className={`h-[30px] w-[100%] object-contain`}
        />
        <div className="flex"></div>
      </div>
      <div className="flex flex-1 flex-col px-6 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6  h-min-[100vh] sm:h-auto pb-0 justify-start">
        <div className="flex justify-between items-center mt-[1rem] mb-[1rem]">
          <h2 className="text-[26px] text-left text-4xl leading-9 tracking-tight text-primary-orange">
            My profiles
          </h2>
          <button
            onClick={handleDownloadAllPDFLinks}
            disabled={downloadProgress > 0 || orderHistory.length === 0}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
              downloadProgress > 0 || orderHistory.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-orange hover:bg-orange-600'
            }`}
          >
            {downloadProgress > 0 ? (
              <span>{downloadProgress}%</span>
            ) : (
              <span>📥 Download</span>
            )}
          </button>
        </div>
        {combinedHistory.length > 0 ? (
          <div className="my-6 flex flex-col gap-[30px]">
            {paginatedItems.map((item, i) => (
              <Link key={i} to={`/view-ticket/${item.purchase_number}`}>
                <div
                  className={`ticket rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500 ${"bg-d-orange"}   `}
                >
                  {item.type === 'ticket' ? (
                    <>
                      <div className="flex justify-between ">
                        <div className="flex flex-col justify-between flex-[0.9]">
                          <p
                            className={`text-base  mb-3 ${"font-medium text-white"}`}
                          >
                            {item.ticketData[0].ticket_name}
                          </p>
                        </div>

                        {item.addonData.length > 0 && (
                          <div className="flex flex-col justify-between items-end text-right  h-50">
                            <span>
                              <p
                                className={`text-base font-medium text-right  ${"text-white"}`}
                              >
                                Add-ons: {item.addonData.length}
                              </p>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex">
                        {item.items?.packages[0].date.map((dt, idx) => (
                          <p
                            key={idx}
                            className={`text-sm opacity-50 text-left ${"text-white"}`}
                          >
                            {moment(dt, "YYYY-MM-DD").format("DD-MM-YYYY")}
                            {item.items?.packages[0].date.length !==
                              idx + 1 && <span>,&nbsp;</span>}
                          </p>
                        ))}
                      </div>

                      <div className={`mt-[1rem]`}>
                        <div className="border border-screen-light opacity-70 mb-5" />
                        <DataLine
                          leftData={
                            <Link
                              to={`/view-ticket/${item.purchase_number}`}
                              className="flex gap-3"
                            >
                              details
                              <img width="8px" src={caretRightWhite} />
                            </Link>
                          }
                          rightData={"AED " + item.total}
                          whiteText
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between ">
                        <div className="flex flex-col justify-between flex-[0.9]">
                          <p
                            className={`text-base  mb-3 ${"font-medium text-white"}`}
                          >
                            {item.name}
                          </p>
                        </div>
                      </div>

                      <div className={`mt-[1rem]`}>
                        <div className="border border-screen-light opacity-70 mb-5" />
                        <DataLine
                          leftData={
                            <Link
                              to={`/view-ticket/${item.purchase_number}`}
                              className="flex gap-3"
                            >
                              details
                              <img width="8px" src={caretRightWhite} />
                            </Link>
                          }
                          rightData={"AED " + item.price}
                          whiteText
                        />
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {/* Pagination Controls */}
        {combinedHistory.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 my-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-orange hover:bg-orange-600'
              }`}
            >
              Previous
            </button>
            <span className="text-primary-orange font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-orange hover:bg-orange-600'
              }`}
            >
              Next
            </button>
          </div>
        )}

        <div className="my-10">
          <DataLine leftData={"Full name"} rightData={profileData.name} />
          <DataLine leftData={"Email address"} rightData={profileData.email} />
          <DataLine leftData={"Phone number"} rightData={profileData.mobile} />
        </div>
      </div>
      <div className="mx-auto w-full sticky bottom-0" onClick={handleLogout}>
        <div className="flex sm:px-6 justify-between items-center text-screen-light bg-primary-orange px-[1rem] py-[2rem] cursor-pointer ">
          <div>Log out</div>
          <CaretIcon />
        </div>
      </div>
    </div>
  );
}
