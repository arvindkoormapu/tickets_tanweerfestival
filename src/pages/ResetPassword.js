import React, { useState } from "react";
import BackButton from "../components/BackButton";
import caretRightWhite from "../assets/caret-right-white.svg";
import { fetchClient } from "../AxiosConfig";
import Loader from "../components/Loader";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import { useEffect } from "react";
import { title } from "../constants/index";

export default function ResetPassword() {
  const [resetFormData, setResetFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // window.analytics.page();
    document.title = `Reset Password - ${title}`;
  }, []);

  const handleFormData = (input) => {
    setResetFormData((prevState) => {
      return {
        ...prevState,
        [input.name]: input.value,
      };
    });
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    let params = new URLSearchParams(window.location.search);
    var key = params.get("key");
    const formData = new FormData();
    formData.append("action", "resetPassword");
    // formData.append("email", resetFormData.email);
    formData.append("password", resetFormData.password);
    formData.append("key", key);
    const data = await fetchClient(formData, "POST", "");
    if (data) setTimeout(() => navigate("/signin"), 1000);
    else setLoading(false);
  };

  return (
    <div className="signIn flex min-h-full">
      <form className="flex flex-1 flex-col  sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10   text-4xl leading-9 tracking-tight text-primary-orange">
            Reset Password
          </h2>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            {/* <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder=" "
                value={resetFormData.email}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  resetFormData.email?.length
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-formDarkGray border-solid border-2" // border-2 looks accurate to the design
                    : "border-formGray border-solid border-2" // If we put border-1 and 2 above, it will have a minor UI breakage
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px]  flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute left-[1.8rem] top-2 text-formSubGray transition-all duration-300 ${
                  resetFormData.email
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Email address
              </label>
            </div> */}
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder=" "
                value={resetFormData.password}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  resetFormData.password?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-2"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange  flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                // #note: (suggestion)
                // focus:ring focus:border-primary-400
                // in both INPUT elements can be removed, IMO
              />
              <label
                htmlFor="password"
                className={`absolute left-[1.8rem] top-2 text-primary-orange transition-all duration-300 ${
                  resetFormData.password
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Password
              </label>
            </div>
            <div className="relative mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder=" "
                value={resetFormData.confirmPassword}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  resetFormData.confirmPassword?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-2"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange  flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                // #note: (suggestion)
                // focus:ring focus:border-primary-400
                // in both INPUT elements can be removed, IMO
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute left-[1.8rem] top-2 text-primary-orange transition-all duration-300 ${
                  resetFormData.confirmPassword
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Re-type Password
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 sm:px-6 sm:mx-auto sm:w-full sm:max-w-sm mt-10">
          <div className=" flex w-full sm:w-auto">
            <button
              disabled={
                loading ||
                !resetFormData.password?.length ||
                !resetFormData.confirmPassword?.length ||
                resetFormData.password.length < 6 ||
                resetFormData.password !== resetFormData.confirmPassword
              }
              onClick={handleFormSubmit}
              className={` flex w-full justify-between items-center ${
                loading ||
                !resetFormData.password?.length ||
                !resetFormData.confirmPassword?.length ||
                resetFormData.password.length < 6 ||
                resetFormData.password !== resetFormData.confirmPassword
                  ? "bg-primary-orange opacity-[75%]"
                  : "bg-primary-orange"
              } relative overflow-hidden px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-semibold text-screen-light shadow-sm focus-visible:outline`}
            >
              Reset Password{loading && <Loader />}
              <img
                alt={`caretRightWhiteFormSignIn`}
                // className="sm:invisible"
                width="14px"
                src={caretRightWhite}
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
