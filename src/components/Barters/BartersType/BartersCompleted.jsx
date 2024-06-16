import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersCompleted = ({ offers }) => {
  return (
    <div className='container' id='offers-completed' >
      <div className='list'>
        <div className='list-item'>
          <h1>Завершённые</h1>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersCompleted;