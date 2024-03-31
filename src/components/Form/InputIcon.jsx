import React from 'react';
import Icon from '../Icon/Icon';

const InputIcon = ({ icon, onClick, disabled }) => {
    if (!icon) {
        return null;
    }

    let iconWrapperClassname = 'icon-wrapper';
    iconWrapperClassname = onClick ? `${iconWrapperClassname} clickable` : iconWrapperClassname;
    iconWrapperClassname = disabled ? `${iconWrapperClassname} pe-none` : iconWrapperClassname;

    return (
        <div className={iconWrapperClassname} onClick={onClick}>
            <Icon icon={icon} />
        </div>
    );
};

export default InputIcon;