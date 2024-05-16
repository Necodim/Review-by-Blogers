import React from 'react';
import './Form.css';

const CheckboxField = ({ id, title, label, comment, onChange, checked, error, ...checkboxProps }) => {
	return (
		<div id={'input-block-' + id} className='input-block'>
			{error && <small className='error-wrapper'>{error}</small>}
			{id && title && <label htmlFor={id}>{title}</label>}
			<label htmlFor={id} className='checkbox'>
				<input
					id={id}
					type="checkbox"
					onChange={onChange}
					checked={checked}
					{...checkboxProps}
				/>
				<span className='checkbox-custom' />
				<span className='checkbox-label'>{label}</span>
			</label>
			{comment && <small className='checkbox-comment'>{comment}</small>}
		</div>
	);
};

export default CheckboxField;