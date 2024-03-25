import React from "react";
import './Button.css';
import { useTelegram } from "../../hooks/useTelegram";

const Link = ({ className, onClick, url, children, ...buttonProps }) => {
    const { hapticFeedback } = useTelegram();

    const handleClick = (event) => {
        // Вызываем haptic feedback только если это не переход по ссылке
        if (!url) {
            hapticFeedback({ type: 'impact', style: 'light' });
        }
        if (onClick) onClick(event);
    }

    return (
        <button
            {...buttonProps}
            className={`button link ${className || ''}`}
            onClick={url ? () => window.open(url, '_blank') : handleClick}
        >
            {children}
        </button>
    );
}

export default Link;