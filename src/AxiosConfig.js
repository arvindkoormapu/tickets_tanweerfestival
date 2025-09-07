import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { notifyError, notifySuccess } from "./utils/notifyToast";

export const fetchClient = (data, method, url) => {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL + "/" + url,
    method: method,
    withCredentials: true, // This is crucial for CORS with credentials
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  axiosInstance.interceptors.request.use(async (config) => {
    config.data = data;
    
    // Set Authorization header if token exists
    if (localStorage.getItem("uuid")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("uuid")}`;
    }
    
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      if (res.data.success || res.data.succcess) {
        if (res.data.message) {
          notifySuccess(res.data.message);
        }
        return res.data;
      } else {
        notifyError(
          res.data?.message ? (
            <div dangerouslySetInnerHTML={{ __html: res.data?.message }} />
          ) : (
            "Something went wrong"
          )
        );
        return "";
      }
    },
    (err) => {
      console.log(err);
      
      // Handle CORS errors specifically
      if (err.code === 'ERR_NETWORK') {
        notifyError("Network error - please check your connection or try again");
        return Promise.reject(err);
      }
      
      if (err.response && err.response.status === 403) {
        notifyError("Login Failed, please relogin again");
        googleLogout();
        localStorage.removeItem("uuid");
        setTimeout(() => (window.location.href = "/signin"), 2000);
      } else {
        // Make sure to reject the promise for other errors
        return Promise.reject(err);
      }
    }
  );

  return axiosInstance();
};