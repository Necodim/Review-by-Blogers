import React, { useEffect, useState } from "react";
import './Button.css'
import Icon from '../Icon/Icon';

const Button = (props) => {
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
      const disabled = props.className?.includes('disabled');
      setIsDisabled(disabled);
    }, [props.className]);

    return (
        <button {...props} className={'button' + (props.className ? ' ' + props.className : '')} disabled={isDisabled}>
            { props.icon && <Icon icon={ props.icon } size={ props.size }></Icon> }
            { props.children }
        </button>
    )
}

export default Button