import React, { useEffect, useState } from "react";
import './Button.css'
import { useTelegram } from "../../hooks/useTelegram";
import Icon from '../Icon/Icon';

const Button = (props) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const { hapticFeedback } = useTelegram();

    useEffect(() => {
      const disabled = props.className?.includes('disabled');
      setIsDisabled(disabled);
    }, [props.className]);

    const handleClick = () => {
        hapticFeedback({ type: 'impact', style: 'medium' });
        props.onClick();
    }

    return (
        <button {...props} className={'button' + (props.className ? ' ' + props.className : '')} onClick={handleClick} disabled={isDisabled}>
            { props.icon && <Icon icon={ props.icon } size={ props.size }></Icon> }
            { props.children }
        </button>
    )
}

export default Button