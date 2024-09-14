import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";

export default function GoogleSignin() {
  const navigate = useNavigate();

  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse),
  //   flow: "auth-code",
  //   ux_mode: "redirect",
  //   redirect_uri: "http://localhost:3000/login-redirect/",
  //   // redirect_uri: "https://staging.tanweerfestival.com/login-redirect/",
  // });

  const responseMessage = (response) => {
    navigate("/login-redirect", { state: response.credential });
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="mb-4 w-full flex justify-center items-center">
      {/* <button onClick={() => login()}>Sign in with Google</button> */}
      <GoogleLogin
        onSuccess={responseMessage}
        onError={errorMessage}
        width="330px"
        shape="circle"
      />
    </div>
  );
}
