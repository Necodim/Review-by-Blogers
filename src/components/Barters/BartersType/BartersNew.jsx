import React from 'react';
import Heading1 from '../Heading/Heading1';
import BartersGrid from '../BartersGrid';

const BartersNew = ({ offers }) => {
  return (
    <div className='container' id='offers-new' >
      <Heading1 title='Новые предложения' />
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersNew;