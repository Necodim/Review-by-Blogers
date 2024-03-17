import React from 'react';
import './Form.css';
import Icon from '../Icon/Icon';

// const Input = ({ id, title, type, min, max, step, placeholder, fade, value, onChange, name, icon, iconcallback }) => {
    const Input = (props) => {
    const handleChange = props.onChange || (() => {});
    const inputName = props.name || props.id || 'defaultName';

    const inputIcon = () => {
        let iconWrapperClassname = 'icon-wrapper';
        iconWrapperClassname = props.iconcallback ? [iconWrapperClassname, 'clickable'].join(' ') : '';
        
        if (props.icon) {
            return (
                <div className={iconWrapperClassname} onClick={props.iconcallback}>
                    <Icon icon={props.icon} />
                </div>
            );
        } else {
            return null;
        }
    }

    const notCheckbox = () => {
        return (
            <div id={'input-block-' + props.id} className='input-block'>
                {props.id && props.title && <label htmlFor={props.id}>{props.title}</label>}
                <div className='input-wrapper'>
                    <input {...props}
                        name={inputName} 
                        onChange={handleChange} 
                    />
                    {props.fade && <div className='input-fade' />}
                    {inputIcon()}
                </div>
                {props.comment && <small>{props.comment}</small>}
            </div>
        )
    }

    const checkbox = () => {
        return (
            <div id={'input-block-' + props.id} className='input-block'>
                {props.id && props.title && <label htmlFor={props.id} className='checkbox-wrapper'>
                    <span>{props.title}</span>
                    <div className='input-wrapper checkbox'>
                        <input {...props}
                            name={inputName}  
                            onChange={handleChange} 
                        />
                        <span>{props.placeholder}</span>
                    </div>
                </label>}
                {props.comment && <small>{props.comment}</small>}
            </div>
        )
    }

    const inputToReturn = props.type && props.type === 'checkbox' ? checkbox() : notCheckbox();

    return (
        inputToReturn
    );
}

Input.defaultProps = {
    type: 'text',
    placeholder: 'Текст',
};

export default Input;
