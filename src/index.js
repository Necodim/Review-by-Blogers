import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProfileProvider } from './hooks/UserProfileContext';
import Background from './components/Background/Background';

if (location.pathname.endsWith('/')) {
  const newPathname = location.pathname.slice(0, -1);
  history.pushState({}, '', newPathname);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </BrowserRouter>
    <Background />
  </React.StrictMode>
);
