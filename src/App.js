import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTelegram } from './hooks/useTelegram';
import { useUserProfile } from './hooks/UserProfileContext';
import Preloader from './components/Preloader/Preloader';
import StartScreen from './components/StartScreen/StartScreen'
// import Onboarding from './components/Onboarding/Onboarding'
import Store from './components/Store/Store'
import Barter from './components/Barter/Barter'
import Profile from './components/Profile/Profile'
import Subscribe from './components/Profile/Subscribe';
import Settings from './components/Settings/Settings';

function App() {
  const { defaultSettings, tg } = useTelegram();
  const { profile, loading } = useUserProfile();

  useEffect(() => {
    tg.ready();
    defaultSettings();
  }, [tg, defaultSettings]);
  
  if (loading) {
    return <Preloader>Загружаюсь...</Preloader>;
  }
  
  return (
    <div className="app">
      <Routes>
        <Route index element={profile && profile.role ? <Navigate to={`/${profile.role}`} replace /> : <StartScreen />} />
        <Route path={`/:role/store`} element={<Store />} />
        <Route path={`/:role/barter`} element={<Barter />} />
        <Route path={`/:role/subscribe`} element={<Subscribe />} />
        <Route path='settings' element={<Settings />} />
        <Route path='/:role' element={<Profile />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;