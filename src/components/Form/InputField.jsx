import React from 'react';
import './Form.css';
import InputIcon from './InputIcon';

const InputField = ({ id, title, icon, iconCallback, fade, comment, onChange, ...inputProps }) => {
    const handleChange = onChange || (() => {});

    return (
        <div id={'input-block-' + id} className='input-block'>
            {id && title && <label htmlFor={id}>{title}</label>}
            <div className='input-wrapper'>
                <input {...inputProps} name={inputProps.name || id || 'input-name'} onChange={handleChange} />
                {fade && <div className='input-fade' />}
                <InputIcon icon={icon} onClick={iconCallback} />
            </div>
            {comment && <small>{comment}</small>}
        </div>
    );
};

export default InputField;