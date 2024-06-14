import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import api from './api/api.js';
import { BrowserRouter } from 'react-router-dom';
import { UserProfileProvider } from './hooks/UserProfileContext';
import Background from './components/Background/Background';
import Preloader from "./components/Preloader/Preloader.jsx";

if (location.pathname.endsWith('/')) {
  const newPathname = location.pathname.slice(0, -1);
  history.pushState({}, '', newPathname);
}

// api.telegramInitData();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <React.Suspense fallback={<Preloader>Загружаюсь...</Preloader>}>
              <UserProfileProvider>
                  <App />
              </UserProfileProvider>
          </React.Suspense>
      </BrowserRouter>
    <Background />
    <div id='popup-root' />
  </React.StrictMode>
);
