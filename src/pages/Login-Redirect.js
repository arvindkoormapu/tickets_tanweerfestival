import React, { useEffect, useState } from "react";
import { fetchClient } from "../AxiosConfig";
import {
  useLocation,
  useNavigate,
} from "../../node_modules/react-router-dom/dist/index";
import { title } from "../constants/index";
import { profileDetails } from "../ProfileApi";

export default function LoginRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.analytics.page();
    document.title = `Login Redirect - ${title}`;
    const handleRegister = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append("action", "googleLogin");
      formData.append("token", location.state);
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
    handleRegister();
  }, []);
  return <></>;
}
