import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersNew = ({ offers }) => {
  return (
    <div className='container' id='offers-new' >
      <div className='list'>
        <div className='list-item'>
          <h1>Новые предложения</h1>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersNew;