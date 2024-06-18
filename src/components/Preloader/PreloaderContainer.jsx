import React from 'react'

const PreloaderContainer = ({ title, text }) => {
  return (
    <div className='container' id='loading'>
      <div className='list'>
        <div className='list-item'>
          <h1>{title || 'Загрузка'}</h1>
        </div>
        <div className='list-item'>
          <p>{text || 'Подождите, идёт загрузка...'}</p>
        </div>
      </div>
    </div>
  );
}

export default PreloaderContainer;