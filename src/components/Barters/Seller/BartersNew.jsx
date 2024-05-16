import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersNew = ({ barters }) => {
  return (
    <div className='container' id='barters-new' >
      <div className='list'>
        <div className='list-item'>
          <h2>Новые предложения</h2>
        </div>
      </div>
      <BartersGrid barters={barters} />
    </div>
  );
}

export default BartersNew;