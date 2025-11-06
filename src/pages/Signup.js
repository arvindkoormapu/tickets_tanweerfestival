import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import caretRightWhite from "../assets/caret-right-white.svg";
import { fetchClient } from "../AxiosConfig";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import Loader from "../components/Loader";
import { notifyInfo } from "../utils/notifyToast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GoogleSignin from "../components/GoogleSignin";
import { title } from "../constants/index";
import { profileDetails } from "../ProfileApi";

export default function Signup() {
  const [signUpData, setSignUpData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    age18: false,
    agreeTerms: false,
  });
  const [errorData, setErrorData] = useState({
    email: false,
    password: false,
    mobile: false,
    age18: false,
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  useEffect(() => {
    // window.analytics.page();
    document.title = `Sign up - ${title}`;
    if (localStorage.getItem("uuid")) {
      notifyInfo("Redirecting...");
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirectPath), 1000);
    }
  }, []);

  const handleFormData = (input) => {
    setSignUpData((prevState) => {
      return {
        ...prevState,
        [input.name]:
          input.name === "agreeTerms" || input.name === "age18"
            ? input.checked
            : input.value,
      };
    });
  };

  const handleFormSubmit = async () => {
    if (
      !signUpData.email.length ||
      !emailRegex.test(signUpData.email) ||
      signUpData.password.length < 8 ||
      signUpData.mobile.length < 9 ||
      !signUpData.agreeTerms ||
      !signUpData.age18
    ) {
      setErrorData({
        email: !signUpData.email.length || !emailRegex.test(signUpData.email),
        password: signUpData.password.length < 8,
        mobile: signUpData.mobile.length < 9,
        agreeTerms: !signUpData.agreeTerms,
        age18: !signUpData.age18,
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "signUp");
    formData.append("email", signUpData.email);
    formData.append("name", signUpData.name);
    formData.append("password", signUpData.password);
    formData.append("mobile", signUpData.mobile);
    const data = await fetchClient(formData, "POST", "");
    if (data) {
      if (data.data.token) {
        localStorage.setItem("uuid", data.data.token);
        await profileDetails();
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      }
    }
    setLoading(false);
  };

  return (
    <div className="signUp flex min-h-full">
      <div className="w-full flex flex-1 flex-col  sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between">
        <div className="px-6 pt-12  sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 text-start text-[32px] leading-9 tracking-tight text-primary-orange">
            Create your account
          </h2>

          <div className="mt-10 ">
            <GoogleSignin />
            <div className="relative" style={{ margin: 0 }}>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder=" "
                value={signUpData.name}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  signUpData.name?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-1"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-primary-orange transition-all duration-300 ${
                  signUpData.name
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Full Name
              </label>
            </div>
            <div className="relative m-0">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder=" "
                value={signUpData.email}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  signUpData.email?.length
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-1"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange  items-center focus:ring focus:border-primary-orange focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-primary-orange transition-all duration-300 ${
                  signUpData.email
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Email address
              </label>
            </div>
            {errorData.email && (
              <p className="w-[100%] text-sm text-left ml-[1rem] mt-[.5rem] text-red">
                Invalid email format
              </p>
            )}
            <div className="relative" style={{ margin: 0 }}>
              <PhoneInput
                country={"ae"}
                inputProps={{
                  require: true,
                }}
                numberInputProps={{
                  className: "outline-none text-black ", // my Tailwind classes
                }}
                searchPlaceholder={"search for country"}
                enableSearch={true}
                disableSearchIcon={true}
                id="mobile"
                name="mobile"
                type="number"
                autoComplete="mobile"
                required
                value={signUpData.mobile}
                disabled={loading}
                onChange={(phone) =>
                  handleFormData({ name: "mobile", value: phone })
                }
                containerClass={` border ${
                  signUpData.mobile?.length
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-1"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[12px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                buttonStyle={{
                  border: "none",
                  backgroundColor: "white",

                  // width:"20%",

                  // height:"100%"
                }}
                inputClass={"text-primary-orange"}
                inputStyle={{
                  border: "none",
                  onfocus: "border-primary-orange",
                  // color:"white"
                }}
                searchStyle={{
                  border: "none",
                }}
                dropdownClass={"rounded-md"}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                  signUpData.mobile
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              ></label>
              {errorData.mobile && (
                <p className="w-[100%] text-sm text-left ml-[1rem] mt-[.5rem] text-red">
                  Invalid Phone number
                </p>
              )}
              <div className="relative" style={{ margin: 0 }}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder=" "
                  value={signUpData.password}
                  disabled={loading}
                  onChange={(e) => handleFormData(e.target)}
                  className={`border ${
                    signUpData.password?.length
                      ? // #note: Design file has border-1.5 and border-1 respectively
                        "border-primary-orange border-solid border-2"
                      : "border-secondary-orange border-solid border-1"
                  } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange  items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
                />
                <label
                  htmlFor="email"
                  className={`absolute pointer-events-none left-[1.8rem]  text-primary-orange transition-all duration-300 ${
                    signUpData.password
                      ? "text-xs top-[1rem]"
                      : "text-md top-[1.5rem]"
                  }`}
                >
                  Password
                </label>
              </div>
              {errorData.password && (
                <p className="w-[100%] text-sm text-left ml-[1rem] mt-[.5rem] text-red">
                  Password must be at least 8 characters long.
                </p>
              )}
              <div class=" ml-5 mt-5 text-primary-orange flex items-center mb-4">
                <input
                  id="age18-checkbox"
                  type="checkbox"
                  name="age18"
                  checked={signUpData.age18}
                  onChange={(e) => handleFormData(e.target)}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-primary-orange rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-primary-orange focus:ring-2 dark:bg-primary-orange dark:border-primary-orange"
                />
                <label
                  for="age18-checkbox"
                  class=" ml-2 text-sm font-medium text-primary-orange dark:text-primary-orange"
                >
                  I am over 18 years old
                </label>
              </div>
              {errorData.age18 && (
                <p className="w-[100%] text-sm text-left ml-[1rem] mt-[.5rem] text-red">
                  Age must be 18+ old
                </p>
              )}
              <div class=" ml-5 mt-5 text-primary-orange flex items-center mb-4">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  name="agreeTerms"
                  checked={signUpData.agreeTerms}
                  onChange={(e) => handleFormData(e.target)}
                  class="w-4 h-4 text-primary-orange bg-primary-orange border-primary-orange rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-primary-orange focus:ring-2 dark:bg-primary-orange dark:border-primary-orange"
                />
                <label
                  for="default-checkbox"
                  class=" ml-2 text-sm font-medium text-primary-orange dark:text-primary-orange"
                >
                  I agree to the{" "}
                  <Link to="/terms-conditions" className="underline">
                    terms and conditions
                  </Link>
                </label>
              </div>
              {errorData.agreeTerms && (
                <p className="w-[100%] text-sm text-left ml-[1rem] text-red">
                  You must agree to the terms and conditions.
                </p>
              )}
            </div>
            {/* <div className="relative" style={{ margin: 0 }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder=" "
                value={signUpData.confirmPassword}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  signUpData.confirmPassword?.length
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-formDarkGray border-solid border-2"
                    : "border-formGray border-solid border-2"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px]   items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  text-formSubGray transition-all duration-300 ${
                  signUpData.confirmPassword
                    ? "text-xs top-[1rem]"
                    : "text-md top-[1.5rem]"
                }`}
              >
                Re-type Password
              </label>
            </div> */}
          </div>
        </div>
        <div className="sticky bottom-0 bg-white sm:px-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-10 mb-5 text-center text-sm text-gray-300 text-secondary-orange font-[400]">
            If you already have an account,{" "}
            <Link
              to={loading ? null : "/signin"}
              className="font-semibold leading-6 text-primary-orange underline"
            >
              Sign in
            </Link>{" "}
            here
          </p>
          <div className="flex w-full sm:w-auto">
            <button
              disabled={
                loading ||
                !signUpData.name?.length ||
                !signUpData.email?.length ||
                !signUpData.password?.length ||
                !signUpData.mobile?.length
                //  ||
                // !signUpData.confirmPassword?.length ||
                // signUpData.password.length < 6 ||
                // signUpData.password !== signUpData.confirmPassword
              }
              onClick={handleFormSubmit}
              className={`flex w-full justify-between items-center ${
                loading ||
                !signUpData.name?.length ||
                !signUpData.email?.length ||
                !signUpData.password?.length ||
                !signUpData.mobile?.length
                  ? // ||
                    // !signUpData.confirmPassword?.length ||
                    // signUpData.password.length < 6 ||
                    // signUpData.password !== signUpData.confirmPassword
                    "bg-light-orange bg-opacity-[75%]"
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
