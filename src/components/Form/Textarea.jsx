import React from 'react';
import './Form.css';

const Textarea = ({ id, title, name, rows, placeholder, value, onChange, disabled }) => {
    return (
        <div id={'input-block-' + id} className='input-block'>
            {id && title && <label htmlFor={id}>{title}</label>}
            <textarea
                id={id}
                name={name}
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            ></textarea>
        </div>
    );
};

Textarea.defaultProps = {
    rows: '5',
    placeholder: 'Введите текст',
};

export default Textarea;