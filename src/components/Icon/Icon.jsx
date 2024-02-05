import React from 'react'
import 'material-icons/iconfont/material-icons.css';
import './Icon.css'

const Icon = (props) => {
    const iconType = !!props.className && props.className.indexOf('outline') !== -1 ? 'material-icons-outlined' : 'material-icons-round';

    let iconClass = ['icon', iconType];
    props.size ? iconClass.push(props.size) : false;
    props.className ? iconClass.push(props.className) : false;
    iconClass = iconClass.join(' ');

    return (
        <span {...props} className={iconClass}>
            {props.icon}
        </span>
    )
}

Icon.defaultProps = {
    size: 'normal',
};

export default Icon