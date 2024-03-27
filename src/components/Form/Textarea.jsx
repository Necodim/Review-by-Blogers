import React from 'react';
import './Form.css';

const Textarea = ({ id, title, name, rows, placeholder, value, onChange }) => {
    return (
        <div id={'input-block-' + id} className='input-block'>
            {id && title && <label htmlFor={id}>{title}</label>}
            <textarea
                id={id}
                name={name}
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            ></textarea>
        </div>
    );
};

Textarea.defaultProps = {
    rows: '5',
    placeholder: 'Введите текст',
};

export default Textarea;