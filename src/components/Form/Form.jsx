import React from 'react';
import './Form.css';
import Button from '../Button/Button';

const Form = ({ className, btnicon, btntext, isDisabled, text, ...props }) => {
    return (
        <form {...props} className={`form-wrapper ${className || ''}`}>
            {props.children}
            <Button type="submit" icon={btnicon} className={isDisabled ? 'disabled' : ''}>{btntext}</Button>
            {text && <small>{text}</small>}
        </form>
    );
};

Form.defaultProps = {
    btntext: 'Отправить',
};

export default Form;