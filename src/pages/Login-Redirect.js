import React, { useEffect, useState } from "react";
import { fetchClient } from "../AxiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
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

      // ✅ safer: read token from query params
      const query = new URLSearchParams(location.search);
      const token = query.get("token") || location.state;

      if (!token) {
        console.error("No token found in redirect");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("action", "googleLogin");
      formData.append("token", token);

      const data = await fetchClient(formData, "POST", "");

      if (data?.data?.token) {
        try {
          localStorage.setItem("uuid", data.data.token);
        } catch (e) {
          console.warn("Could not store uuid", e);
        }

        const userData = await profileDetails();
        const traits = JSON.parse(localStorage.setItem("user_data", userData) || "{}");
        const hasMobile = traits.mobile;

        navigate(hasMobile ? "/" : "/complete-profile");
      }

      setLoading(false);
    };

    handleRegister();
  }, []);

  return <></>;
}
