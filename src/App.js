import React, { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import {Route, Routes} from 'react-router-dom'
import StartScreen from './components/StartScreen/StartScreen'
import Category from './components/Category/Category'
import Store from './components/Store/Store'
import Barter from './components/Barter/Barter'
import Profile from './components/Profile/Profile'

function App() {
  const {onToggleButton, tg} = useTelegram();

  useEffect(() => {
    tg.ready();
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route index element={<StartScreen />}/>
        <Route path={'bloger/category'} element={<Category />}/>
        <Route path={'bloger/barter'} element={<Barter />}/>
        <Route path={'bloger/profile'} element={<Profile />}/>
        <Route path={'seller/store'} element={<Store />}/>
        <Route path={'seller/barter'} element={<Barter />}/>
        <Route path={'seller/profile'} element={<Profile />}/>
      </Routes>
    </div>
  );
}

export default App;
