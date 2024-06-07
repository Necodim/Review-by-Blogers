import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { SelectedProductsProvider } from './hooks/useSelectProductsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReferral } from './hooks/useReferral';
import { useTelegram } from './hooks/useTelegram';
import { useUserProfile } from './hooks/UserProfileContext';
import Preloader from './components/Preloader/Preloader';
import StartScreen from './components/StartScreen/StartScreen';
import Store from './components/Store/Store';
import CategoryPage from './components/Store/Blogger/CategoryPage';
import ProductPage from './components/Store/ProductPage';
import ProductsPage from './components/Store/ProductsPage';
import BartersPage from './components/Barters/BartersPage';
import BartersTypePage from './components/Barters/BartersTypePage';
import BarterPage from './components/Barters/BarterPage';
import NewBarterPage from './components/Barters/BartersPage';
import Profile from './components/Profile/Profile';
import Subscribe from './components/Profile/Subscription/Subscribe';
import SetWbApi from './components/Profile/SetApi/SetWbApi';
import WaitingForCapturePage from './pages/Subscription/WaitingForCapturePage';
import SettingsPage from './pages/Settings/SettingsPage';
import SupportPage from './pages/Info/SupportPage';
import UserAgreementPage from './pages/Info/UserAgreementPage';

function App() {
  const { setReferral } = useReferral();
  const { tg, defaultSettings } = useTelegram();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (let param of searchParams) {
      const [key, value] = param;
      params[key] = value;
    }
    
    if (params.ref) {
      setReferral(params.ref);
    }

    if (params.page) {
      navigate(decodeURIComponent(params.page));
    }
  }, []);

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
    if ((location.pathname !== '/' && location.pathname !== '/settings' && !location.pathname.startsWith('/info')) && (!profile || (profile.role !== 'seller' && profile.role !== 'blogger'))) {
      navigate('/');
    }
  }, [profile, navigate, location.pathname, loading]);

  useEffect(() => {
    if (tg) {
      tg.ready();
      defaultSettings();
    } else {
      console.log('Telegram Web App API не доступен.');
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
        <Route path="/profile/subscribe/waiting-for-capture" element={<WaitingForCapturePage />} />
        <Route path="/profile/api" element={<SetWbApi />} />
        <Route path="/store" element={<SelectedProductsProvider><Store /></SelectedProductsProvider>} />
        <Route path="/store/categories/:subCategoryId" element={<SelectedProductsProvider><CategoryPage /></SelectedProductsProvider>} />
        <Route path="/store/products/:productId" element={<ProductPage />} />
        <Route path="/store/products" element={<SelectedProductsProvider><ProductsPage /></SelectedProductsProvider>} />
        <Route path="/barters" element={<BartersPage />} />
        <Route path="/barters/type/:type" element={<BartersTypePage />} />
        <Route path="/barters/:barterId/:offerId" element={<BarterPage />} />
        <Route path="/barters/new/:productId" element={<NewBarterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/info/support" element={<SupportPage />} />
        <Route path="/info/user-agreement" element={<UserAgreementPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;