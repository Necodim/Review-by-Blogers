import React from 'react';
import './Form.css';
import { useTelegram } from '../../hooks/useTelegram';
import InputIcon from './InputIcon';

const SelectField = ({ id, title, name, placeholder, options, value, comment, onChange, error }) => {
  const { hapticFeedback } = useTelegram();

  const handleChange = (event) => {
    hapticFeedback({ type: 'selection' });
    onChange(event);
  };

  return (
    <div id={'input-block-' + id} className='input-block'>
      {error && <small className='error-wrapper'>{error}</small>}
      {id && title && <label htmlFor={id}>{title}</label>}
      <div className='input-wrapper'>
        <select name={name} onChange={handleChange} value={value}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='input-fade' />
        <InputIcon icon='arrow_drop_down' disabled={true} />
      </div>
      {comment && <small>{comment}</small>}
    </div>
  );
};

export default SelectField;