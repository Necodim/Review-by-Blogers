import { useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import '../components/Toast/Toast.css'

export const useToastManager = () => {
  const loadingToastIdRef = useRef(null);

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
      // Показываем или обновляем тост загрузки
      if (loadingToastIdRef.current === null) {
        loadingToastIdRef.current = toast.loading(message, options);
      } else {
        toast.update(loadingToastIdRef.current, { ...options, render: message, isLoading: true });
      }
    } else {
      // Для success и error, закрываем тост загрузки, если он открыт
      if (loadingToastIdRef.current !== null) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null; // Сброс ID тоста загрузки
      }
      // Показываем тост успеха или ошибки
      type === 'success' ? toast.success(message, options) : type === 'error' ? toast.error(message, options) : type === 'warning' ? toast.warning(message, options) : toast.info(message, options);
    }
  };

  // Предоставляем функцию для сброса ID тоста загрузки, если нужно закрыть его вручную
  const resetLoadingToast = () => {
    if (loadingToastIdRef.current !== null) {
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }
  };

  return { showToast, resetLoadingToast };
};
