import toast, { ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info';

const useToast = () => {
  const showToast = (message: string, type: ToastType) => {
    toast[type](message);
  };
  return showToast;
};

export default useToast;
