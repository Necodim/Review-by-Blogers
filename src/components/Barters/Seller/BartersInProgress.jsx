import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersInProgress = ({ barters }) => {
  return (
    <div className='container' id='barters-progress' >
      <div className='list'>
        <div className='list-item'>
          <h2>В работе</h2>
        </div>
      </div>
      <BartersGrid barters={barters} />
    </div>
  );
}

export default BartersInProgress;