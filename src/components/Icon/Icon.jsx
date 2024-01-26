import React from 'react'
import 'material-icons/iconfont/material-icons.css';
import './Icon.css'

const Icon = (props) => {
    const iconType = !!props.className && props.className.indexOf('outline') !== -1 ? 'material-icons-outlined' : 'material-icons-round';

    return (
        <span className={iconType + ' ' + props.size}>
            {props.icon}
        </span>
    )
}

export default Icon