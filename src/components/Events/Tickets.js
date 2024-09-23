import BackButton from "../BackButton";
import { useState } from "react";
import Popup from "../Popup";
import { quantityActions } from "../../constants";
import CaretIcon from "../Icons/CaretIcon";
import carelSvg from "../../assets/caret.svg";
import carelWhite from "../../assets/caretWhite.svg";
import profile from "../../assets/icons8-customer-64.png";
import carelBlack from "../../assets/caret-up-black.svg";
import carelDownWhite from "../../assets/carel-down-white.svg";
import { notifyError, notifyInfo } from "../../utils/notifyToast";
import Loader from "../Loader";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import { Link } from "react-router-dom";
import mastercardLogos from "../../mastercard.jpg";
import visaLogos from "../../visa.png";

export default function Tickets({
  tempTicketList,
  ticketList,
  setTicketList,
  selectedTicket,
  setSelectedTicket,
  tempSelectedTicket,
  setTempSelectedTicket,
  setDateList,
  setAddonList,
  selectedFilter,
  setSelectedFilter,
  handleNextStep,
  setAddonFilter,
  handlePreviousStep,
  qty,
  setQty,
  payAmount,
  loading,
  packageLoading,
}) {
  const [isPopupOpen, setIspopupOpen] = useState(false);
  const filters = ["All", "Day Pass", "Festival Pass"];
  const navigate = useNavigate();

  const handleExpand = (ticket) => {
    if (loading) {
      return;
    }
    setDateList([]);
    setAddonList([]);
    setAddonFilter("All");
    // if (Object.keys(selectedTicket).length && selectedTicket.id !== ticket.id) {
    //   setIspopupOpen(true);
    //   setTempSelectedTicket(ticket);
    //   return;
    // }
    const expandTicketFn = () => {
      const tempTicketList = ticketList.map((tkt) => {
        if (tkt.id === ticket.id) {
          tkt.showMore = !tkt.showMore;
          // setSelectedTicket(ticket);
        } else {
          tkt.showMore = false;
        }
        return tkt;
      });
      setTicketList(tempTicketList);
      window.analytics.track("Product Viewed", {
        name: ticket.package_name,
        product_id: ticket.id,
      });
    };

    // if (selectedTicket.id !== ticket.id) setQty(0);

    // notifyInfo("Quantity has been reset");

    // const expandTicketFn = () => {
    //   setSelectedTicket(ticket);
    //   const tempTicketList = ticketList.map((tkt) => {
    //     if (tkt.id === ticket.id) tkt.showMore = !tkt.showMore;
    //     return tkt;
    //   });
    //   setTicketList(tempTicketList);
    // };
    const scrollToTicket = () => {
      const ticketElm = document.querySelector(`#t${ticket.id}`);
      if (ticketElm && ticketElm?.scrollIntoView)
        ticketElm.scrollIntoView({
          behavior: "smooth",
        });
    };
    expandTicketFn();
    setTimeout(scrollToTicket, 10); // #note MS can be increased to 100 for more time
  };

  const handleResetTicket = () => {
    setSelectedTicket(tempSelectedTicket);
    const tempTicketList = ticketList.map((tkt) => {
      if (tkt.id === tempSelectedTicket.id) {
        tkt.qty = 1;
      } else {
        tkt.qty = 0;
      }
      return tkt;
    });
    // setQty(0);
    setTicketList(tempTicketList);
    setIspopupOpen(false);
  };

  const handleFilterChange = (filter) => {
    if (loading) {
      return;
    }
    const list = tempTicketList.map((ticket) => {
      ticket.qty = 0;
      ticket.showMore = false;
      return ticket;
    });
    setTicketList(
      filter === "All"
        ? list
        : list.filter((item) => item.tags.includes(filter))
    );
    setSelectedFilter(filter);
    setSelectedTicket({});
    setDateList([]);
    setAddonList([]);
  };

  const handleQuantity = (action, ticket) => {
    if (
      loading ||
      (action === quantityActions.DECREMENT && ticket.qty - 1 === -1)
    ) {
      return;
    }
    if (Object.keys(selectedTicket).length && selectedTicket.id !== ticket.id) {
      setIspopupOpen(true);
      setTempSelectedTicket(ticket);
      return;
    }
    const tempTicketList = ticketList.map((tkt) => {
      if (tkt.id === ticket.id) {
        if (
          action === quantityActions.INCREMENT &&
          tkt.qty < tkt.available_tickets
        ) {
          tkt.qty = tkt.qty + 1;
          setSelectedTicket(ticket);
        } else if (action === quantityActions.DECREMENT && tkt.qty > 0) {
          tkt.qty = tkt.qty - 1;
          setSelectedTicket(ticket);
          if (!tkt.qty) setSelectedTicket({});
        } else {
          notifyInfo("Sorry, Inventory not available");
        }
      } else {
        tkt.qty = 0;
      }
      return tkt;
    });
    // if (selectedTicket.id !== ticket.id) setQty(0);
    setTicketList(tempTicketList);
    // if (action === quantityActions.INCREMENT) {
    //   setQty((qty) => qty + 1);
    //   setSelectedTicket(ticket);
    // } else {
    //   if (qty > 0)
    //     setQty((qty) => {
    //       if (qty - 1 === 0) {
    //         setSelectedTicket({});
    //       }
    //       return qty - 1;
    //     });
    // }
  };

  return (
    <div className="tickets flex flex-col min-h-full   sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0  ">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6 sm:py-12  lg:px-8 h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          {" "}
          {/* <BackButton onClick={handlePreviousStep} /> */}
          <div className="flex justify-between items-center">
            <h2 className="mt-10 mb-[2rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
              Select your ticket
            </h2>
            {localStorage.getItem("uuid") && (
              <img
                src={profile}
                className="object-contain w-[8%] mt-2 cursor-pointer "
                onClick={() => navigate("/profile")}
              />
            )}
          </div>
          <div className="flex w-full overflow-x-auto gap-[12px] scrollbar-thin">
            {filters.map((filter, i) => (
              <div
                key={i}
                className={`whitespace-nowrap rounded-[200px] px-[1rem] py-[0.2rem] border ${
                  (!loading || !packageLoading) && "cursor-pointer"
                } ${
                  selectedFilter === filter
                    ? "text-white bg-secondary-orange border-orange"
                    : "text-secondary-orange border-secondary-orange"
                } text-sm font-medium text-left `}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
          <div className="my-6 flex flex-col gap-[30px]">
            <>
              {packageLoading ? (
                <div>
                  <svg
                    role="img"
                    fill="#CCCCCC"
                    width="100%"
                    height="450"
                    aria-labelledby="loading-aria"
                    viewBox="0 0 340 450"
                    preserveAspectRatio="none"
                  >
                    <title id="loading-aria">Loading...</title>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      clip-path="url(#clip-path)"
                      // style='fill: url("#fill");'
                    ></rect>
                    <defs>
                      <clipPath id="clip-path">
                        <rect
                          x="12"
                          y="60"
                          rx="3"
                          ry="3"
                          width="67"
                          height="11"
                        />
                        <rect
                          x="88"
                          y="60"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="139"
                          y="108"
                          rx="3"
                          ry="3"
                          width="91"
                          height="11"
                        />
                        <rect
                          x="14"
                          y="108"
                          rx="3"
                          ry="3"
                          width="100"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="83"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="178"
                          y="83"
                          rx="3"
                          ry="3"
                          width="48"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="16"
                          rx="0"
                          ry="0"
                          width="220"
                          height="27"
                        />
                        <rect
                          x="283"
                          y="16"
                          rx="0"
                          ry="0"
                          width="73"
                          height="27"
                        />
                        <rect
                          x="14"
                          y="128"
                          rx="0"
                          ry="0"
                          width="214"
                          height="10"
                        />
                        <rect
                          x="305"
                          y="111"
                          rx="0"
                          ry="0"
                          width="21"
                          height="20"
                        />
                        <rect
                          x="12"
                          y="206"
                          rx="3"
                          ry="3"
                          width="67"
                          height="11"
                        />
                        <rect
                          x="88"
                          y="206"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="139"
                          y="254"
                          rx="3"
                          ry="3"
                          width="91"
                          height="11"
                        />
                        <rect
                          x="14"
                          y="254"
                          rx="3"
                          ry="3"
                          width="100"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="229"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="178"
                          y="229"
                          rx="3"
                          ry="3"
                          width="48"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="162"
                          rx="0"
                          ry="0"
                          width="220"
                          height="27"
                        />
                        <rect
                          x="283"
                          y="162"
                          rx="0"
                          ry="0"
                          width="73"
                          height="27"
                        />
                        <rect
                          x="14"
                          y="274"
                          rx="0"
                          ry="0"
                          width="214"
                          height="10"
                        />
                        <rect
                          x="305"
                          y="257"
                          rx="0"
                          ry="0"
                          width="21"
                          height="20"
                        />
                        <rect
                          x="12"
                          y="358"
                          rx="3"
                          ry="3"
                          width="67"
                          height="11"
                        />
                        <rect
                          x="88"
                          y="358"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="139"
                          y="406"
                          rx="3"
                          ry="3"
                          width="91"
                          height="11"
                        />
                        <rect
                          x="14"
                          y="406"
                          rx="3"
                          ry="3"
                          width="100"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="381"
                          rx="3"
                          ry="3"
                          width="140"
                          height="11"
                        />
                        <rect
                          x="178"
                          y="381"
                          rx="3"
                          ry="3"
                          width="48"
                          height="11"
                        />
                        <rect
                          x="12"
                          y="314"
                          rx="0"
                          ry="0"
                          width="220"
                          height="27"
                        />
                        <rect
                          x="283"
                          y="314"
                          rx="0"
                          ry="0"
                          width="73"
                          height="27"
                        />
                        <rect
                          x="14"
                          y="426"
                          rx="0"
                          ry="0"
                          width="214"
                          height="10"
                        />
                        <rect
                          x="305"
                          y="409"
                          rx="0"
                          ry="0"
                          width="21"
                          height="20"
                        />
                      </clipPath>
                      <linearGradient id="fill">
                        <stop
                          offset="0.599964"
                          stop-color="#f3f3f3"
                          stop-opacity="1"
                        >
                          <animate
                            attributeName="offset"
                            values="-2; -2; 1"
                            keyTimes="0; 0.25; 1"
                            dur="2s"
                            repeatCount="indefinite"
                          ></animate>
                        </stop>
                        <stop
                          offset="1.59996"
                          stop-color="#fff2e5"
                          stop-opacity="1"
                        >
                          <animate
                            attributeName="offset"
                            values="-1; -1; 2"
                            keyTimes="0; 0.25; 1"
                            dur="2s"
                            repeatCount="indefinite"
                          ></animate>
                        </stop>
                        <stop
                          offset="2.59996"
                          stop-color="#f3f3f3"
                          stop-opacity="1"
                        >
                          <animate
                            attributeName="offset"
                            values="0; 0; 3"
                            keyTimes="0; 0.25; 1"
                            dur="2s"
                            repeatCount="indefinite"
                          ></animate>
                        </stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ) : (
                <>
                  {ticketList
                    .sort((a, b) => a.position - b.position)
                    .map((ticket, i) => (
                      <div
                        key={i}
                        id={`t${ticket.id}`}
                        className={`ticket rounded-lg ${
                          !loading && "cursor-pointer"
                        } px-[28px] py-[15px] transition-all relative ease-in-out duration-500 ${
                          selectedTicket?.id === ticket.id || ticket.showMore
                            ? "bg-d-orange"
                            : "bg-[#FFF7E0]"
                        }   `}
                        onClick={() => handleExpand(ticket)}
                      >
                        {ticket.offer_text && (
                          <span className="absolute top-[-12px] left-[10px] whitespace-nowrap rounded-[200px] px-[1rem] py-[0.2rem] border text-white bg-secondary-orange border-orange text-sm font-medium text-left">
                            {ticket.offer_text}
                          </span>
                        )}
                        <div className="flex justify-between ">
                          <div className="flex flex-col justify-between flex-[0.9]">
                            <p
                              className={`text-base  my-3 ${
                                selectedTicket?.id === ticket.id ||
                                ticket.showMore
                                  ? "font-medium text-white"
                                  : // #note: font weight is medium in design
                                    // but here, semibold is more readable and closer to design look
                                    "font-semibold text-primary-orange"
                              }`}
                            >
                              {ticket.package_name}
                            </p>
                            {ticket.description && (
                              <p
                                className={`w-[100%] text-sm   text-left ${
                                  selectedTicket?.id === ticket.id ||
                                  ticket.showMore
                                    ? "text-l-orange"
                                    : "text-primary-orange"
                                }`}
                              >
                                {ticket.description}
                              </p>
                            )}
                          </div>
                          {/* <div className="flex  justify-between items-end w-full h-auto  flex-[0.25]"> */}
                          <div className="flex flex-col justify-between my-3 items-end text-right  h-50">
                            <span>
                              <p
                                className={`text-base font-medium text-right  ${
                                  selectedTicket?.id === ticket.id ||
                                  ticket.showMore
                                    ? "text-white"
                                    : "text-d-orange"
                                }`}
                              >
                                AED {ticket.price}
                              </p>{" "}
                              <p
                                // text-xs
                                className={`text-[11px]  text-right  ${
                                  selectedTicket?.id === ticket.id ||
                                  ticket.showMore
                                    ? "opacity-50 text-white"
                                    : " text-secondary-orange "
                                }`}
                              >
                                Per person
                              </p>
                            </span>

                            <img
                              src={
                                ticket.showMore
                                  ? carelWhite
                                  : !ticket.showMore &&
                                    selectedTicket.id === ticket.id
                                  ? carelDownWhite
                                  : carelSvg
                              }
                              alt="carelSvg"
                              className={`h-[24px] w-[24px] text-d-orange`}
                            />
                          </div>
                        </div>
                        {ticket.showMore && (
                          <div className={`py-[1rem] mt-[1rem]`}>
                            <div className="border border-[#E9E9EB] opacity-20 mb-5" />
                            {ticket.available_tickets > 0 ? (
                              <div
                                className={`flex justify-between  ${
                                  selectedTicket?.id === ticket.id ||
                                  ticket.showMore
                                    ? "text-white"
                                    : "text-black"
                                } items-center`}
                              >
                                <div className={`text-sm `}>Quantity</div>
                                <div className={`flex`}>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantity(
                                        quantityActions.DECREMENT,
                                        ticket
                                      );
                                    }}
                                    className={`h-[30px] w-[30px] rounded-[2rem] text-center border  ${
                                      selectedTicket?.id === ticket.id ||
                                      ticket.showMore
                                        ? "border-[#FBE899]"
                                        : "border-black"
                                    } cursor-pointer flex flex-col items-center justify-center`}
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
                                      <path
                                        d="M12 0H0V2H12V0Z"
                                        fill={`${
                                          selectedTicket?.id === ticket.id ||
                                          ticket.showMore
                                            ? "white"
                                            : "black"
                                        }`}
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    className={`mx-[0.8rem] my-[auto] text-base font-medium text-center w-[15px] ${
                                      selectedTicket?.id === ticket.id ||
                                      ticket.showMore
                                        ? "text-white"
                                        : "text-black"
                                    } `}
                                  >
                                    {ticket.qty}
                                  </div>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantity(
                                        quantityActions.INCREMENT,
                                        ticket
                                      );
                                    }}
                                    className={`h-[30px] w-[30px] rounded-[2rem] text-center border  ${
                                      selectedTicket?.id === ticket.id ||
                                      ticket.showMore
                                        ? "border-[#FBE899]"
                                        : "border-black"
                                    } cursor-pointer flex flex-col items-center justify-center`}
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
                                        fill={`${
                                          selectedTicket?.id === ticket.id ||
                                          ticket.showMore
                                            ? "white"
                                            : "black"
                                        }`}
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-base text-white font-medium text-center">
                                Sold Out
                              </p>
                            )}
                            {ticket.img && (
                              <img
                                className={`w-full my-[1.25rem] rounded-lg`}
                                src={ticket.img}
                              />
                            )}

                            {ticket.highlights && (
                              <div className="ml-[1.5rem]">
                                <ul>
                                  {ticket.highlights.map((keyPoint, i) => (
                                    <li
                                      style={{
                                        listStyle: "disc",
                                      }}
                                      className={`${
                                        selectedTicket?.id === ticket.id ||
                                        ticket.showMore
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
                    ))}
                </>
              )}
            </>
          </div>
        </div>
      </div>
      <div className="sm:mx-auto  w-full sm:w-full sm:max-w-md sticky sm:static bottom-0 sm:bottom-auto">
        {/* <div className="flex justify-between items-center text-white bg-black p-[1rem] text-[14px] border-b-[2px] border-white">
          <div>Total</div>
          <div>{payAmount} AED</div>
        </div> */}
        <div
          onClick={() =>
            !localStorage.getItem("uuid")
              ? navigate("/signup")
              : selectedTicket.qty > 0 && handleNextStep()
          }
          className={`flex justify-between items-center ${
            selectedTicket.qty > 0 || !localStorage.getItem("uuid")
              ? "bg-primary-orange"
              : "bg-primary-orange "
          } relative overflow-hidden text-white  px-[1rem] py-[2rem] ${
            !loading && "cursor-pointer"
          } `}
        >
          <div className="w-full flex justify-between">
            <span>Total Cost: AED {payAmount}</span>
            <span className="mr-8">
              {!localStorage.getItem("uuid") ? "Sign up" : "Continue"}
            </span>
          </div>
          {loading && <Loader />}
          <CaretIcon />
        </div>
        <div className="flex flex-row justify-between px-[1rem] bg-[#fff] py-[0.2rem]">
          <div className="flex flex-row justify-between gap-[12px]">
            <img
              src={visaLogos}
              alt="Visa and Mastercard Logos"
              className={`h-[24px] w-[24px] object-contain`}
            />
            <img
              src={mastercardLogos}
              alt="Visa and Mastercard Logos"
              className={`h-[24px] w-[24px] object-contain`}
            />
          </div>
          <div className="flex flex-row justify-between gap-[12px]">
            <Link to="/privacy-policy" className="text-[12px]">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-[12px]">
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} width="w-[90vw] sm:w-[50vw]">
        <h2 className="text-xl font-bold mb-2 mt-3 text-center">
          Your selection will be reset.
        </h2>
        <p className="text-center m-3">Are you sure?</p>
        <div className="flex gap-0 sm:gap-2 justify-center flex-col  ">
          <div
            onClick={handleResetTicket}
            className="w-full text-center  flex flex-col justify-between items-center text-white bg-[#c06f39] px-[1rem] py-[1.5rem] cursor-pointer mt-2"
          >
            Continue
          </div>
          <div
            onClick={() => setIspopupOpen(false)}
            className="w-full text-center  flex flex-col justify-between items-center text-white bg-[#c06f39] px-[1rem] py-[1.5rem] cursor-pointer mt-2"
          >
            Keep my selection
          </div>
        </div>
      </Popup>
    </div>
  );
}
