import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackButton = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    const handleHistoryChange = () => {
      setCanGoBack(window.history.length > 2);
    };

    handleHistoryChange();

    // Подписка на изменения истории
    const unlisten = () => {
      return () => {};
    };

    return () => {
      unlisten();
    };
  }, [location]);

  useEffect(() => {
    const notStartPage = location.pathname !== '/' && location.pathname !== '/profile' && location.pathname !== '/store' && location.pathname !== '/barters'
    if (notStartPage && canGoBack) {
      if (location.pathname === '/settings') {
        tg.BackButton.show();
        tg.BackButton.onClick(() => navigate('/profile'));
      } else {
        tg.BackButton.show();
        tg.BackButton.onClick(() => navigate(-1));
      }
    } else {
      tg.BackButton.hide();
      tg.BackButton.offClick();
    }
  }, [location, canGoBack, navigate, tg]);

  return null;
};

export default BackButton;