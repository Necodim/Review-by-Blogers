import React, { useEffect, useState } from "react";
import './Button.css'
import { useTelegram } from "../../hooks/useTelegram";
import Icon from '../Icon/Icon';

const Button = ({ onClick, className, icon, size, children, ...buttonProps }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const { hapticFeedback } = useTelegram();

    useEffect(() => {
      const disabled = className?.includes('disabled');
      setIsDisabled(disabled);
    }, [className]);

    const handleClick = (event) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }
        hapticFeedback({ type: 'impact', style: 'medium' });
        if (onClick) onClick(event);
    }

    return (
        <button {...buttonProps} className={`button ${className || ''}`} onClick={handleClick} disabled={isDisabled}>
            { icon && <Icon icon={icon} size={size}></Icon> }
            { children }
        </button>
    )
}

export default Button