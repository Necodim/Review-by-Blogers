import React from 'react';
import InputField from './InputField';
import CheckboxField from './CheckboxField';
import RadioTabs from './RadioTabs';

const Input = (props) => {
    const { type, ...otherProps } = props;

    switch (type) {
        case 'checkbox':
            return <CheckboxField {...otherProps} />;
        case 'radio':
            return <RadioTabs {...otherProps} />;
        case 'text':
        default:
            return <InputField {...otherProps} />;
    }
};

export default Input;
