import React from 'react';
import './Form.css';
import Icon from '../Icon/Icon';

const Input = ({ id, title, type, placeholder, fade, value, onChange, name, icon, iconcallback }) => {
    const handleChange = onChange || (() => {});
    const inputName = name || id || 'defaultName';

    const inputIcon = () => {
        let iconWrapperClassname = 'icon-wrapper';
        iconWrapperClassname = iconcallback ? [iconWrapperClassname, 'clickable'].join(' ') : '';
        
        if (icon) {
            return (
                <div className={iconWrapperClassname} onClick={iconcallback}>
                    <Icon icon={icon} />
                </div>
            );
        } else {
            return null;
        }
    }

    return (
        <div id={'input-block-' + id} className='input-block'>
            {title && <label htmlFor={id}>{title}</label>}
            <div className='input-wrapper'>
                <input
                    type={type}
                    id={id}
                    name={inputName}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
                {fade && <div className='input-fade' />}
                {inputIcon()}
            </div>
        </div>
    );
}

Input.defaultProps = {
    type: 'text',
    placeholder: 'Текст',
};

export default Input;
