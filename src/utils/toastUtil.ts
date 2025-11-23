import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => toast.success(message);

export const showErrorToast = (message: string) => toast.error(message);

export const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  switch (type) {
    case 'success':
      return toast.success(message);
    case 'error':
      return toast.error(message);
    case 'warning':
      return toast.warning(message);
    case 'info':
    default:
      return toast.info(message);
  }
};
