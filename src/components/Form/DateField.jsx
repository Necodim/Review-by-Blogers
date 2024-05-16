import React, { useState } from 'react';
import './Form.css';
import InputIcon from './InputIcon';

const DateField = ({ id, title, value, comment, onClick, error, ...inputProps }) => {
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(!!value ? value : '');

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
  };

  return (
    <div id={'input-block-' + id} className='input-block'>
      {error && <small className='error-wrapper'>{error}</small>}
      {id && title && <label htmlFor={id}>{title}</label>}
      <div className='input-wrapper'>
        <input
          type='date'
          name={inputProps.name || id || 'input-name'}
          value={selectedDate}
          onChange={handleDateChange}
          {...inputProps}
        />
        <div className='input-fade' />
        <InputIcon icon='calendar_today' disabled={true} />
      </div>
      {comment && <small>{comment}</small>}
    </div>
  );
};

export default DateField;
