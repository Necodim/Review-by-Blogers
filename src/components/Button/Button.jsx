import React from "react";
import './Button.css'
import Icon from '../Icon/Icon';

const Button = (props) => {

    return (
        <button {...props} className={'button' + (props.className ? ' ' + props.className : '')}>
            { props.icon && <Icon icon={ props.icon } size={ props.size }></Icon> }
            { props.children }
        </button>
    )
}

export default Button