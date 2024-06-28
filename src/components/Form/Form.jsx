import React from 'react';
import './Form.css';
import Button from '../Button/Button';

const Form = ({ className, btnicon, btntext, isDisabled, text, ...props }) => {
    return (
        <form {...props} className={`form-wrapper ${className || ''}`}>
            {props.children}
            <Button type="submit" icon={btnicon} className={isDisabled ? 'disabled' : ''} disabled={isDisabled}>{btntext || 'Отправить'}</Button>
            {text && <small>{text}</small>}
        </form>
    );
};

export default Form;