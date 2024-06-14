import React, { useEffect, useState } from 'react';
import { useTelegram } from './useTelegram';

const BackButton = () => {
  const { isAvailable, showBackButton, hideBackButton } = useTelegram();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      // Проверка, есть ли предыдущие страницы в истории
      setCanGoBack(window.history.length > 1);
    };

    // Начальная проверка при монтировании компонента
    handlePopState();

    // Добавление слушателя события изменения истории
    window.addEventListener('popstate', handlePopState);

    // Удаление слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (canGoBack && isAvailable()) {
      // Включение кнопки "Назад"
      showBackButton();
    } else {
      // Выключение кнопки "Назад"
      hideBackButton();
    }
  }, [canGoBack, isAvailable]);

  return null; // Этот компонент не рендерит ничего
};

export default BackButton;