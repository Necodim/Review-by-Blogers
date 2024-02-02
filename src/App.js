import React, { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import { getProfile } from './hooks/getProfile'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header';
import StartScreen from './components/StartScreen/StartScreen'
// import Onboarding from './components/Onboarding/Onboarding'
import Store from './components/Store/Store'
import Barter from './components/Barter/Barter'
import Profile from './components/Profile/Profile'
import Settings from './components/Settings/Settings';

function App() {
  const {defaultSettings, tg} = useTelegram();
  const {userType} = getProfile();

  useEffect(() => {
    tg.ready();
  }, [])

  defaultSettings();

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route index element={<StartScreen />}/>
        <Route path={userType + '/store'} element={<Store />}/>
        <Route path={userType + '/barter'} element={<Barter />}/>
        <Route path={userType + '/profile'} element={<Profile />}/>
        <Route path='settings' element={<Settings />}/>
      </Routes>
    </div>
  );
}

export default App;
