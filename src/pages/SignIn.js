import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import caretRightWhite from "../assets/caret-right-white.svg";
import { fetchClient } from "../AxiosConfig";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import Loader from "../components/Loader";
import { notifyInfo } from "../utils/notifyToast";
import GoogleSignin from "../components/GoogleSignin";
import { title } from "../constants/index";
import { profileDetails } from "../ProfileApi";

export default function SignIn() {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.analytics.page();
    document.title = `Sign in - ${title}`;
    if (localStorage.getItem("uuid")) {
      notifyInfo("Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    }
  }, []);

  const handleFormData = (input) => {
    setSignInData((prevState) => {
      return {
        ...prevState,
        [input.name]: input.value,
      };
    });
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "signIn");
    formData.append("email", signInData.email);
    formData.append("password", signInData.password);
    const data = await fetchClient(formData, "POST", "");
    if (data) {
      if (data.data.token) {
        localStorage.setItem("uuid", data.data.token);
        await profileDetails();
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="signIn flex min-h-full">
      <form
        className="flex flex-1 flex-col  sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0 justify-between"
        onSubmit={handleFormSubmit}
      >
        <div className=" px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10   text-4xl leading-9 tracking-tight text-primary-orange">
            Sign in to your account
          </h2>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <GoogleSignin />
            <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder=" "
                value={signInData.email}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  signInData.email?.length
                    ? // #note: Design file has border-1.5 and border-1 respectively
                      "border-primary-orange border-solid border-2" // border-2 looks accurate to the design
                    : "border-secondary-orange border-solid border-2" // If we put border-1 and 2 above, it will have a minor UI breakage
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange flex items-center focus:ring focus:border-primary-400 focus:placeholder-transparent mt-2`}
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem]  top-2 text-primary-orange transition-all duration-300 ${
                  signInData.email
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Email address
              </label>
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder=" "
                value={signInData.password}
                disabled={loading}
                onChange={(e) => handleFormData(e.target)}
                className={`border ${
                  signInData.password?.length
                    ? "border-primary-orange border-solid border-2"
                    : "border-secondary-orange border-solid border-2"
                } outline-none ring-transparent w-full rounded-[30px] px-[28px] py-[16px] text-primary-orange  flex items-center focus:ring focus:border-primary-orange focus:placeholder-transparent mt-2`}
                // #note: (suggestion)
                // focus:ring focus:border-primary-400
                // in both INPUT elements can be removed, IMO
              />
              <label
                htmlFor="email"
                className={`absolute pointer-events-none left-[1.8rem] top-2 text-primary-orange transition-all duration-300 ${
                  signInData.password
                    ? "text-xs top-[.2rem]"
                    : "text-md top-[1rem]"
                }`}
              >
                Password
              </label>
            </div>

            {/*
                            #note: Can be set as optional just like in figma design
                            {signInData.password ? ELEMENT : null}
                            Usecase: The user might need to press forget password after he attempts to type
                            So in my opinion we can always show 'forgot your password'
                        */}
            <p className="mt-5 text-center text-sm text-gray-500">
              <Link
                to={loading ? null : "/forgot-password"}
                className="font-medium leading-6 text-primary-orange underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white sm:px-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-10 mb-5 text-center text-sm text-gray-300 text-primary-orange font-normal">
            If you don't have an account,{" "}
            <Link
              to={loading ? null : "/signup"}
              className="font-semibold leading-6 text-primary-orange underline"
            >
              Sign up{" "}
            </Link>
            here
          </p>
          <div className="flex w-full sm:w-auto">
            <div></div>
            <button
              disabled={
                loading ||
                !signInData.email?.length ||
                !signInData.password?.length ||
                signInData.password.length < 6
              }
              onClick={handleFormSubmit}
              className={`flex w-full justify-between items-center ${
                loading ||
                !signInData.email?.length ||
                !signInData.password?.length ||
                signInData.password.length < 6
                  ? "bg-primary-orange opacity-[75%]"
                  : "bg-primary-orange"
              } relative overflow-hidden px-[1rem] py-[2rem] text-[16px] px-[28px] py-[16px] text-sm font-semibold text-screen-light shadow-sm focus-visible:outline`}
            >
              Login
              {loading && <Loader />}
              <img
                alt={`caretRightWhiteFormSignIn`}
                className="ml-4"
                width="8px"
                src={caretRightWhite}
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
