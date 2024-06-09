import React from 'react'
import 'material-icons/iconfont/material-icons.css';
import './Icon.css'

const Icon = (props) => {
    const iconType = !!props.className && props.className.indexOf('outline') !== -1 ? 'material-icons-outlined' : 'material-icons-round';

    let iconClass = ['icon', iconType];
    if (!!props.size) iconClass.push(props.size);
    if (!!props.onClick) iconClass.push('c-pointer');
    iconClass = iconClass.join(' ');

    return (
        <span {...props} className={iconClass + (props.className ? ' ' + props.className : '')}>
            {props.icon}
        </span>
    )
}

export default Icon
