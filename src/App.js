import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTelegram } from './hooks/useTelegram';
import { useUserProfile } from './hooks/UserProfileContext';
import Preloader from './components/Preloader/Preloader';
import StartScreen from './components/StartScreen/StartScreen';
import Store from './components/Store/Store';
import CategoryPage from './components/Store/CategoryPage';
import ProductPage from './components/Store/ProductPage';
import ProductsInactivePage from './components/Store/ProductsInactivePage';
import ProductsActivePage from './components/Store/ProductsActivePage';
import Barter from './components/Barter/Barter';
import Profile from './components/Profile/Profile';
import Subscribe from './components/Profile/Subscription/Subscribe';
import Settings from './components/Settings/Settings';

function App() {
  const { tg, defaultSettings } = useTelegram();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const initialHeight = tg.viewportStableHeight;
  
    function handleResize() {
      const newHeight = tg.viewportHeight;
      const difference = initialHeight - newHeight;
      if (difference > 0) {
        setKeyboardHeight(difference);
        document.documentElement.style.setProperty('--keyboard-height', `${difference}px`);
      } else {
        setKeyboardHeight(0);
        document.documentElement.style.setProperty('--keyboard-height', `0px`);
      }
    }
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if ((location.pathname !== '/' && location.pathname !== '/settings') && (!profile || (profile.role !== 'seller' && profile.role !== 'blogger'))) {
      navigate('/');
    }
  }, [profile, navigate, location.pathname, loading]);

  useEffect(() => {
    if (tg) {
      tg.ready();
      defaultSettings();
    } else {
      console.log("Telegram Web App API не доступен.");
    }
  }, [tg, defaultSettings]);

  if (loading) {
    return <Preloader>Загружаюсь...</Preloader>;
  }

  return (
    <div className="app">
      <Routes>
        <Route index element={!profile || !profile.role ? <StartScreen /> : <Navigate to="/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/subscribe" element={<Subscribe />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/categories/category-:id" element={<CategoryPage />} />
        <Route path="/store/products/product-:id" element={<ProductPage />} />
        <Route path="/store/products/active" element={<ProductsActivePage />} />
        <Route path="/store/products/inactive" element={<ProductsInactivePage />} />
        <Route path="/barter" element={<Barter />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;