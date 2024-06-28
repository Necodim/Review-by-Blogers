import React, { useState } from 'react';
import './Form.css';
import InputIcon from './InputIcon';
import { useEvents } from '../../hooks/useEvents';

const DateField = ({ id, title, value, comment, onClick, error, min, max, onChange, ...inputProps }) => {
  const { handleFocus } = useEvents();
  
  return (
    <div id={'input-block-' + id} className='input-block'>
      {error && <small className='error-wrapper'>{error}</small>}
      {id && title && <label htmlFor={id}>{title}</label>}
      <div className='input-wrapper'>
        <input
          type='date'
          id={id}
          name={inputProps.name || id || 'input-name'}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          onFocus={handleFocus}
        />
        <div className='input-fade' />
        <InputIcon icon='calendar_today' disabled={true} />
      </div>
      {comment && <small>{comment}</small>}
    </div>
  );
};

export default DateField;
