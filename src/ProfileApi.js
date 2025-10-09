import { fetchClient } from "./AxiosConfig";

export const profileDetails = async () => {
  const data = await fetchClient("", "GET", "?action=profile");
  if (data) {
    const emailBase64 = btoa(data.data.email);
    // window.analytics.identify(emailBase64, {
    //   name: data.data.name,
    //   email: data.data.email,
    //   mobile: data.data.mobile
    // });
  }
  return data ? data : "";
};
