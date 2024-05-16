import React from 'react';
import BartersGrid from '../BartersGrid';

const BartersCompleted = ({ barters }) => {
  return (
    <div className='container' id='barters-completed' >
      <div className='list'>
        <div className='list-item'>
          <h2>Завершённые</h2>
        </div>
      </div>
      <BartersGrid barters={barters} />
    </div>
  );
}

export default BartersCompleted;