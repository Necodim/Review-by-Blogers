import React from 'react';
import './Form.css';
import Button from '../Button/Button';

const Form = (props) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.onSubmit) props.onSubmit(e);
    };

    let formClass = 'form-wrapper';
    formClass = props.className ? [formClass, props.className].join(' ') : '';

    return (
        <form {...props} className={ formClass } onSubmit={ handleSubmit }>
            { props.children }
            <Button type='submit' icon={ props.btnicon }>{ props.btntext }</Button>
        </form>
    );
}

export default Form;