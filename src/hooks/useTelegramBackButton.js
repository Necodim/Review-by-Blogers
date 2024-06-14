import React, { useEffect, useState } from 'react';

// Подключение скрипта Telegram Web App
const tg = window.Telegram.WebApp;

const BackButton = () => {
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
    if (canGoBack) {
      // Включение кнопки "Назад"
      tg.BackButton.show();
    } else {
      // Выключение кнопки "Назад"
      tg.BackButton.hide();
    }
  }, [canGoBack]);

  return null; // Этот компонент не рендерит ничего
};

export default BackButton;