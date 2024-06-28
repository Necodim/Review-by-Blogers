import React from 'react';
import './Form.css';
import InputIcon from './InputIcon';
import { useEvents } from '../../hooks/useEvents';

const InputField = ({ id, title, icon, iconCallback, fade, comment, onChange, error, ...inputProps }) => {
	const { handleFocus } = useEvents();

	const handleChange = onChange || (() => { });

	return (
		<div id={'input-block-' + id} className='input-block'>
			{error && <small className='error-wrapper'>{error}</small>}
			{id && title && <label htmlFor={id}>{title}</label>}
			<div className='input-wrapper'>
				<input {...inputProps} name={inputProps.name || id || 'input-name'} onChange={handleChange} onFocus={handleFocus} />
				{(icon || fade) && <div className='input-fade' />}
				<InputIcon icon={icon} onClick={iconCallback} />
			</div>
			{comment && <small>{comment}</small>}
		</div>
	);
};

export default InputField;