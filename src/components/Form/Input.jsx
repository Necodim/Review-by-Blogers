import React from 'react';
import CheckboxField from './CheckboxField';
import RadioTabs from './RadioTabs';
import FileField from './FileField';
import DateField from './DateField';
import InputField from './InputField';

const Input = (props) => {
    const { type, ...otherProps } = props;

    switch (type) {
        case 'checkbox':
            return <CheckboxField {...otherProps} />;
        case 'radio':
            return <RadioTabs {...otherProps} />;
        case 'file':
            return <FileField {...otherProps} />;
        case 'date':
            return <DateField {...otherProps} />;
        case 'url':
            return <InputField {...otherProps} />;
        case 'text':
        default:
            return <InputField {...otherProps} />;
    }
};

export default Input;
