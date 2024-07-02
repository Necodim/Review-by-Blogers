import React from 'react'
import Heading1 from '../Barters/Heading/Heading1';

const PreloaderContainer = ({ title, text }) => {
  return (
    <div className='container' id='loading'>
      <Heading1 title={title || 'Загрузка'}>
        <div className='list-item'>
          <p>{text || 'Подождите, идёт загрузка...'}</p>
        </div>
      </Heading1>
    </div>
  );
}

export default PreloaderContainer;