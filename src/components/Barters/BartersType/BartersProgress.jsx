import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersProgress = ({ offers }) => {
  return (
    <div className='container' id='offers-progress' >
      <div className='list'>
        <div className='list-item'>
          <h2>В работе</h2>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersProgress;