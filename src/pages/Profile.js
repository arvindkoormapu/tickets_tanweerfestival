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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.analytics.page();
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
      if (data) {
        console.log(data.data);
        setOrderHistory(data.data);
      }
      setLoading(false);
    };
    getOrderHistory();
    getprofileDetails();
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("uuid");
    navigate("/signin");
  };

  return (
    <div className="addons flex flex-col min-h-full   sm:px-6 sm:py-12   h-[100vh] sm:h-auto pb-0  ">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6 sm:py-12 h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          <Link to="/">
            <BackButton />
          </Link>
          <h2 className="my-10  text-left w-[70%] sm:w-full  text-4xl leading-9 tracking-tight text-primary-orange">
            My profile
          </h2>

          <div className="my-6 flex flex-col gap-[30px]">
            {orderHistory.map((orderHis, i) => (
              <Link to={`/view-ticket/${orderHis.purchase_number}`}>
                <div
                  key={i}
                  // id={orderHis.id}
                  className={`ticket rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500 ${"bg-d-orange"}   `}
                >
                  <div className="flex justify-between ">
                    <div className="flex flex-col justify-between flex-[0.9]">
                      <p
                        className={`text-base  mb-3 ${"font-medium text-white"}`}
                      >
                        {orderHis.ticketData[0].ticket_name}
                      </p>
                    </div>

                    {orderHis.addonData.length > 0 && (
                      <div className="flex flex-col justify-between items-end text-right  h-50">
                        <span>
                          <p
                            className={`text-base font-medium text-right  ${"text-white"}`}
                          >
                            Add-ons: {orderHis.addonData.length}
                          </p>{" "}
                          {/* <p
                        // text-xs
                        className={`text-[11px] text-right  ${"opacity-50 text-white"}`}
                      >
                        {orderHis.items?.packages[0].tickets[0].qty} {"tickets"}
                      </p> */}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex">
                    {orderHis.items?.packages[0].date.map((dt, idx) => (
                      <p
                        className={`text-sm opacity-50 text-left ${"text-white"}`}
                      >
                        {moment(dt, "YYYY-MM-DD").format("DD-MM-YYYY")}
                        {orderHis.items?.packages[0].date.length !==
                          idx + 1 && <span>,&nbsp;</span>}
                      </p>
                    ))}
                  </div>

                  {/* py-[1rem]  */}
                  <div className={`mt-[1rem]`}>
                    <div className="border border-screen-light opacity-70 mb-5" />{" "}
                    {/* {Object.keys(orderHis.items.packages[0].addons).map(
                    (addon) => (
                      <DataLine
                        key={addon.text}
                        leftData={addon.text}
                        rightData={addon.text}
                        whiteText
                      />
                    )
                  )} */}
                    {/* DEMO  */}
                    <DataLine
                      leftData={
                        <Link
                          to={`/view-ticket/${orderHis.purchase_number}`}
                          className="flex gap-3"
                        >
                          details
                          <img width="8px" src={caretRightWhite} />
                        </Link>
                      }
                      rightData={"AED " + orderHis.total}
                      whiteText
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="my-10">
            <DataLine leftData={"Full name"} rightData={profileData.name} />
            <DataLine
              leftData={"Email address"}
              rightData={profileData.email}
            />
            <DataLine
              leftData={"Phone number"}
              rightData={profileData.mobile}
            />
          </div>
        </div>
      </div>
      <div
        className="sm:mx-auto  w-full sm:w-full sm:max-w-md sticky sm:static bottom-0 sm:bottom-auto"
        onClick={handleLogout}
      >
        <div className="flex justify-between items-center text-screen-light bg-primary-orange px-[1rem] py-[2rem] cursor-pointer ">
          <div>Log out</div>
          <CaretIcon />
        </div>
      </div>
    </div>
  );
}
