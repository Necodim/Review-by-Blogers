import React from 'react';
import './Form.css';
import Icon from '../Icon/Icon';
import { useTelegram } from '../../hooks/useTelegram';

const RadioTabs = ({ id, title, options, onChange, selectedValue }) => {
    const { hapticFeedback } = useTelegram();

    const handleChange = (value) => {
        hapticFeedback({ type: 'selection'});
        onChange(value);
    };

    const label = (option) => {
        if (option.icon) {
            return (
                <label>
                    <Icon icon={option.icon} />
                    <span>{option.label}</span>
                </label>
            );
        } else {
            return (<label><span>{option.label}</span></label>);
        }
    };

    return (
        <div id={'input-block-' + id} className='input-block'>
            {id && title && <label htmlFor={id}>{title}</label>}
            <div className='input-wrapper'>
                <div className="radio-tabs">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`radio-tab ${selectedValue === option.value ? 'active' : ''}`}
                            onClick={() => handleChange(option.value)}
                        >
                            {label(option)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RadioTabs;
