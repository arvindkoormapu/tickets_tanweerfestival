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
    // window.analytics.page();
    document.title = `Login Redirect - ${title}`;

    const handleRegister = async () => {
      setLoading(true);

      // ✅ safer: read token from query params or state
      const query = new URLSearchParams(location.search);
      const token = query.get("token") || (location.state?.credential || location.state);
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";

      if (!token) {
        console.error("No token found in redirect");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("action", "googleLogin");
      formData.append("token", token);

      try {
        const data = await fetchClient(formData, "POST", "");

        if (data?.data?.token) {
          // store auth token
          try {
            localStorage.setItem("uuid", data.data.token);
          } catch (e) {
            console.warn("Could not store uuid", e);
          }

          // fetch profile and store it
          const userData = await profileDetails();
          try {
            localStorage.setItem("user_data", JSON.stringify(userData.data));
          } catch (e) {
            console.warn("Could not store user data", e);
          }

          // ✅ now read user_data instead of ajs_user_traits
          let hasMobile = false;
          try {
            const storedUser = JSON.parse(localStorage.getItem("user_data") || "{}");
            hasMobile = !!storedUser.mobile;
          } catch (e) {
            console.warn("Could not parse user_data", e);
          }

          // Clean up redirect storage
          localStorage.removeItem("redirectAfterLogin");

          // redirect user - use stored redirect path if user has mobile, otherwise go to complete-profile
          navigate(hasMobile ? redirectPath : "/complete-profile");
        }
      } catch (err) {
        console.error("Login redirect failed:", err);
        navigate("/login");
      }

      setLoading(false);
    };

    handleRegister();
  }, [location, navigate]);

  return <></>;
}
