import React from 'react';
import Heading1 from '../Heading/Heading1';
import BartersGrid from '../BartersGrid';

const BartersProgress = ({ offers }) => {
  return (
    <div className='container' id='offers-progress' >
      <Heading1 title='В работе' />
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersProgress;