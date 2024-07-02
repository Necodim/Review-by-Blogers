
import React from 'react';

const Heading1 = ({ title, text, children }) => {
	return (
		<div className='list'>
      <div className='list-item'>
        <h1>{title}</h1>
        {text}
      </div>
      {children}
    </div>
	)
}

export default Heading1;