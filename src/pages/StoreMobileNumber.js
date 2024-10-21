import { useState, useEffect } from "react";
import caretRightWhite from "../assets/caret-right-white.svg";
import { fetchClient } from "../AxiosConfig";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import Loader from "../components/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { profileDetails } from "../ProfileApi";
import { notifyInfo } from "../utils/notifyToast";

export default function StoreMobileNumber() {
  const [mobileNumber, setMobileNumber] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasMobile = JSON.parse(
      localStorage.getItem("ajs_user_traits")
    ).mobile;
    if (hasMobile !== "") {
      notifyInfo("Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    }
  }, []);

  const updateMobile = (e) => {
    setMobileNumber(e);
  };

  const handleFormSubmit = async () => {
    if (mobileNumber.length < 9) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "update_profile");
    formData.append("mobile", mobileNumber);
    const data = await fetchClient(formData, "POST", "");
    if (data.success === 1) {
      await profileDetails();
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="signUp flex min-h-full">
      <div className="w-full flex flex-1 flex-col  sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-start w-3/5 sm:w-[90%]">
            <h2 className="mt-4 text-start text-[32px] leading-9 tracking-tight text-primary-orange">
              Complete your profile
            </h2>
          </div>

          <div className="mt-10 mb-10">
            <div className="relative" style={{ margin: 0 }}>
              <PhoneInput
                country={"ae"}
                inputProps={{
                  require: true,
                }}
                numberInputProps={{
                  className: "outline-none text-black ",
                }}
                searchPlaceholder={"search for country"}
                enableSearch={true}
                disableSearchIcon={true}
                id="mobile"
                name="mobile"
                type="number"
                autoComplete="mobile"
                required
                value={mobileNumber}
                disabled={loading}
                onChange={(phone) => updateMobile(phone)}
                containerClass={` border ${
                  mobileNumber?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-1"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[12px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                buttonStyle={{
                  border: "none",
                  backgroundColor: "white",
                }}
                inputClass={"text-primary-orange"}
                inputStyle={{
                  border: "none",
                  onfocus: "border-primary-orange",
                }}
                searchStyle={{
                  border: "none",
                }}
                dropdownClass={"rounded-md"}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                  mobileNumber ? "text-xs top-[1rem]" : "text-md top-[1.5rem]"
                }`}
              ></label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white sm:px-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex w-full sm:w-auto">
            <button
              disabled={loading || !mobileNumber?.length}
              onClick={() => handleFormSubmit()}
              className={`flex w-full justify-between items-center ${
                loading || !mobileNumber?.length
                  ? "bg-light-orange bg-opacity-[75%]"
                  : "bg-primary-orange"
              } overflow-hidden px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-semibold text-white shadow-sm focus-visible:outline sticky sm:static bottom-0 sm:bottom-auto`}
            >
              {loading && <Loader />}
              <div className="flex justify-center items-center whitespace-nowrap">
                Submit
              </div>
              <img width="14px" src={caretRightWhite} alt="caretRightWhite" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
