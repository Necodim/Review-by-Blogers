

import React, { useEffect, useState } from 'react'
import Header from '../Header/Header';

const PreloaderContainer = ({ title, text }) => {
  const [loadingTitle, setLoadingTitle] = useState('Загрузка');
  const [loadingText, setLoadingText] = useState('Подождите, идёт загрузка...');

  useEffect(() => {
    if (title) setLoadingTitle(title);
    if (text) setLoadingText(text);
  }, [title, text])

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='loading'>
        <div className='list'>
          <div className='list-item'>
            <h1>{loadingTitle}</h1>
          </div>
          <div className='list-item'>
            <p>{loadingText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreloaderContainer;