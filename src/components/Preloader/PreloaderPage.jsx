import React from 'react'
import Header from '../Header/Header';
import PreloaderContainer from './PreloaderContainer';

const PreloaderPage = ({ title, text }) => {
  return (
    <div className='content-wrapper'>
      <Header />
      <PreloaderContainer title={title} text={text} />
    </div>
  );
}

export default PreloaderPage;