import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersProgress = ({ offers }) => {
  return (
    <div className='container' id='offers-progress' >
      <div className='list'>
        <div className='list-item'>
          <h1>В работе</h1>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersProgress;