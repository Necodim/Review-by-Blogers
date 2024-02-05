import React from 'react';
import './Form.css';
import Button from '../Button/Button';

const Form = ({ onSubmit, className, children, btnicon, btntext, ...rest }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Создание объекта formData и сбор данных формы
        const formData = new FormData(e.target);
        const formValues = {};
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        if (onSubmit) {
            onSubmit(formValues);
        }
    };

    let formClass = 'form-wrapper';
    formClass = className ? `${formClass} ${className}` : formClass;

    return (
        <form className={formClass} onSubmit={handleSubmit} {...rest}>
            {children}
            <Button type="submit" icon={btnicon}>{btntext}</Button>
        </form>
    );
}

export default Form;
