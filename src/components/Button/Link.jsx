import React from "react";
import './Button.css'

const Link = (props) => {
    return (
        <button {...props} className={'button link' + (props.className ? ' ' + props.className : '')} onClick={props.url ? () => window.open(props.url, '_blank') : props.onClick ? props.onClick : () => {}}>
            { props.children }
        </button>
    )
}

export default Link