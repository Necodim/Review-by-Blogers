import { useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import '../components/Toast/Toast.css';
import { useTelegram } from './useTelegram';

export const useToastManager = () => {
  const loadingToastIdRef = useRef(null);
  const { hapticFeedback } = useTelegram();

  const showToast = (message, type) => {
    const options = {
      position: 'bottom-center',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark',
      transition: Slide,
    };

    if (type === 'loading') {
      if (loadingToastIdRef.current === null) {
        loadingToastIdRef.current = toast.loading(message, options);
      } else {
        toast.update(loadingToastIdRef.current, { ...options, render: message, isLoading: true });
      }
    } else {
      if (loadingToastIdRef.current !== null) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }

      switch (type) {
        case 'success':
          toast.success(message, options);
          hapticFeedback({ type: 'notification', style: type });
          break;
        case 'error':
          toast.error(message, options);
          hapticFeedback({ type: 'notification', style: type });
          break;
        case 'warning':
          toast.warning(message, options);
          hapticFeedback({ type: 'notification', style: type });
          break;
        default:
          toast.info(message, options);
          hapticFeedback({ type: 'notification', style: 'success' });
          break;
      }
    }
  };

  const resetLoadingToast = () => {
    if (loadingToastIdRef.current !== null) {
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }
  };

  return { showToast, resetLoadingToast };
};
