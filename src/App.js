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
import Subscribe from './components/Profile/Subscribe';
import Settings from './components/Settings/Settings';

function App() {
  const { tg, defaultSettings } = useTelegram();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (location.pathname !== '/' && (!profile || (profile.role !== 'seller' && profile.role !== 'blogger'))) {
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
        <Route path="/store" element={<Store />} />
        <Route path="/store/categories/category-:id" element={<CategoryPage />} />
        <Route path="/store/products/product-:id" element={<ProductPage />} />
        <Route path="/store/products/active" element={<ProductsActivePage />} />
        <Route path="/store/products/inactive" element={<ProductsInactivePage />} />
        <Route path="/barter" element={<Barter />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;