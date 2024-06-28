import React, { useState } from 'react';
import './Form.css';
import { useEvents } from '../../hooks/useEvents';

const Textarea = ({ id, title, name, rows, placeholder, value, onChange, disabled, comment, error }) => {
	const { handleFocus } = useEvents();
	const [textareaValue, setTextareaValue] = useState('');

	const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  }

	return (
		<div id={'input-block-' + id} className='input-block'>
			{error && <small className='error-wrapper'>{error}</small>}
			{id && title && <label htmlFor={id}>{title}</label>}
			<textarea
				id={id}
				name={name}
				rows={rows || '5'}
				placeholder={placeholder || 'Введите текст'}
				value={value || textareaValue}
				onChange={onChange || handleTextareaChange}
				onFocus={handleFocus}
				disabled={disabled}
			></textarea>
			{comment && <small>{comment}</small>}
		</div>
	);
};

export default Textarea;