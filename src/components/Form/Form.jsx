import React from 'react';
import './Form.css';
import Button from '../Button/Button';

const Form = (props) => {
    return (
        <form {...props} className={'form-wrapper' + (props.className ? ' ' + props.className : '')}>
            {props.children}
            <Button type="submit" icon={props.btnicon}>{props.btntext}</Button>
        </form>
    );
}

Form.defaultProps = {
    btntext: 'Отправить',
};

export default Form;