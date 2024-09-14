import { toast } from "react-toastify";

const toastList = new Set();
const MAX_TOAST = 3;

export const notifyError = (message) => {
  if (toastList.size < MAX_TOAST) {
    const id = toast.error(message, {
      onClose: () => toastList.delete(id),
      autoClose: 5000,
      hideProgressBar: true,
    });
    toastList.add(id);
  }
};

export const notifyInfo = (message) => {
  if (toastList.size < MAX_TOAST) {
    const id = toast.info(message, {
      onClose: () => toastList.delete(id),
      autoClose: 5000,
      hideProgressBar: true,
    });
    toastList.add(id);
  }
};

export const notifySuccess = (message) => {
  if (toastList.size < MAX_TOAST) {
    const id = toast.success(message, {
      onClose: () => toastList.delete(id),
      autoClose: message.includes("Login") ? 2000 : 5000,
      hideProgressBar: true,
    });
    toastList.add(id);
  }
};
