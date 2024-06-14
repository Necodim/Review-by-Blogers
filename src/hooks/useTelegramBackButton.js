import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const BackButton = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const history = useHistory();
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    const handleHistoryChange = () => {
      setCanGoBack(history.length > 1);
    };
    handleHistoryChange();
    const unlisten = history.listen(handleHistoryChange);

    return () => {
      unlisten();
    };
  }, [history]);

  useEffect(() => {
    if (canGoBack) {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  }, [canGoBack, tg]);

  return null;
};

export default BackButton;