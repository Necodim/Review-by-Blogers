import React from 'react';
import './Form.css';

const CheckboxField = ({ id, label, comment, onChange, checked, ...checkboxProps }) => {
    return (
        <div id={'input-block-' + id} className='input-block'>
            <label htmlFor={id} className='checkbox'>
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