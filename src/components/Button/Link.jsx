import React from "react";
import './Button.css'
import { useTelegram } from "../../hooks/useTelegram";

const Link = (props) => {
    const { hapticFeedback } = useTelegram();

    const handleClick = () => {
        hapticFeedback({ type: 'impact', style: 'light' });
        props.onClick();
    }

    return (
        <button {...props} className={'button link' + (props.className ? ' ' + props.className : '')} onClick={props.url ? () => window.open(props.url, '_blank') : handleClick}>
            { props.children }
        </button>
    )
}

export default Link