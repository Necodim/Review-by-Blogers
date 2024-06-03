import React from 'react';
import './Quote.css'

const Quote = (props) => {
	return (
		<div className='quote'>
      <div className='quote-line' />
      <div className='quote-text'>{props.children}</div>
    </div>
	);
};

export default Quote;