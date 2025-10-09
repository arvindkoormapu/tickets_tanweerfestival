import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import CaretIcon from "../components/Icons/CaretIcon";
import { fetchClient } from "../AxiosConfig";
import Loader from "../components/Loader";
import { title } from "../constants/index";

export default function ForgotPassword() {
  const [forgotFormData, setForgotFormData] = useState({
    username: "", // username or email
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // window.analytics.page();
    document.title = `Terms & Conditions - ${title}`;
  }, []);

  const handleFormData = (input) => {
    setForgotFormData((prevState) => {
      return {
        ...prevState,
        [input.name]: input.value,
      };
    });
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "forgotPassword");
    formData.append("email", forgotFormData.username);
    const data = await fetchClient(formData, "POST", "");
    if (data) console.log(data);
    setLoading(false);
  };

  return (
    <div className="resetPassword flex min-h-full">
      <form className="flex flex-1 flex-col  sm:px-3 sm:py-6 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to={loading ? null : "/signin"}>
            <BackButton />
          </Link>
          <div className="flex justify-start  w-auto">
            <h2 className="mt-10 text-start text-[32px] leading-9 tracking-tight text-primary-orange">
              Enter your email address to recover your password
            </h2>
          </div>
          <div className="mt-10 ">
            <div className="relative" style={{ margin: 0 }}>
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                required
                placeholder=" "
                value={forgotFormData.username}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  forgotFormData.username?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-2"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-primary-orange transition-all duration-300 pointer-events-none ${
                  forgotFormData.username
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Email address
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white  sm:mx-auto sm:w-full sm:max-w-sm w-auto">
          <p className="mt-10 mb-5 text-center text-sm text-gray-300 text-primary-orange font-normal">
            If you don't have an account,{" "}
            <Link
              to={loading ? null : "/signup"}
              className="font-semibold leading-6 text-primary-orange underline"
            >
              Sign up
            </Link>
          </p>
          <div className="flex w-full sm:w-auto">
            <button
              disabled={loading || !forgotFormData.username?.length}
              onClick={handleFormSubmit}
              className={`flex w-full justify-between items-center ${
                loading || !forgotFormData.username?.length
                  ? "bg-primary-orange opacity-[75%]"
                  : "bg-primary-orange"
              } relative overflow-hidden px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-medium text-screen-light shadow-sm focus-visible:outline`}
            >
              Send Email{loading && <Loader />}
              <CaretIcon width={"14px"} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
