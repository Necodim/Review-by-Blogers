import React from 'react';
import './Form.css';

const Select = ({ id, title, options, placeholder, comment, onChange }) => {
  return (
    <div id={'input-block-' + id} className='input-block'>
      {id && title && <label htmlFor={id}>{title}</label>}
      <div className='input-wrapper'>
        <select onChange={onChange} defaultValue="">
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select></div>
      {comment && <small>{comment}</small>}
    </div>
  );
};

export default Select;