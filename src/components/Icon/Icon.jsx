import React from 'react'
import 'material-icons/iconfont/material-icons.css';
import './Icon.css'

const Icon = (props) => {
    const iconType = !!props.className && props.className.indexOf('outline') !== -1 ? 'material-icons-outlined' : 'material-icons-round';

    let iconClass = props.size ? ['icon', iconType, props.size].join(' ') : ['icon', iconType].join(' ');

    return (
        <span className={iconClass }>
            {props.icon}
        </span>
    )
}

Icon.defaultProps = {
    size: 'normal',
};

export default Icon