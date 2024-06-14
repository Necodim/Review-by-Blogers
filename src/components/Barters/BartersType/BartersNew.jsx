import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersNew = ({ offers }) => {
  return (
    <div className='container' id='offers-new' >
      <div className='list'>
        <div className='list-item'>
          <h2>Новые предложения</h2>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersNew;