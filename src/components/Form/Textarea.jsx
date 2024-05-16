import React from 'react';
import './Form.css';

const Textarea = ({ id, title, name, rows, placeholder, value, onChange, disabled, comment, error }) => {
	return (
		<div id={'input-block-' + id} className='input-block'>
			{error && <small className='error-wrapper'>{error}</small>}
			{id && title && <label htmlFor={id}>{title}</label>}
			<textarea
				id={id}
				name={name}
				rows={rows}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
			></textarea>
			{comment && <small>{comment}</small>}
		</div>
	);
};

Textarea.defaultProps = {
	rows: '5',
	placeholder: 'Введите текст',
};

export default Textarea;