import React from 'react';
import './Form.css';

const CheckboxField = ({ id, label, comment, onChange, checked, ...checkboxProps }) => {
    return (
        <div id={'checkbox-block-' + id} className='checkbox-block'>
            <label htmlFor={id} className='checkbox-label'>
                <input
                    id={id}
                    type="checkbox"
                    onChange={onChange}
                    checked={checked}
                    {...checkboxProps}
                />
                <span className='checkbox-custom' />
                {label}
            </label>
            {comment && <small className='checkbox-comment'>{comment}</small>}
        </div>
    );
};

export default CheckboxField;