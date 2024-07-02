import React from 'react';
import Heading1 from '../Heading/Heading1';
import BartersGrid from '../BartersGrid';

const BartersCompleted = ({ offers }) => {
  return (
    <div className='container' id='offers-completed' >
      <Heading1 title='Завершённые' />
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersCompleted;