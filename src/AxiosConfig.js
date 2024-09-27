import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { notifyError, notifySuccess } from "./utils/notifyToast";

export const fetchClient = (data, method, url) => {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL + url,
    method: method,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    config.data = data;
    if (localStorage.getItem("uuid"))
      config.headers.Authorization = `Bearer ${localStorage.getItem("uuid")}`;
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
      if (err.response && err.response.status === 403) {
        notifyError("Login Failed, please relogin again");
        googleLogout();
        localStorage.removeItem("uuid");
        setTimeout(() => (window.location.href = "/signin"), 2000);
      } else Promise.reject(err);
    }
  );

  return axiosInstance();
};
