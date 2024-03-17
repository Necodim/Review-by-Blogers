import React from 'react';
import './Form.css'

const Textarea = (props) => {
    return (
        <div id={ 'input-block-' + props.id } className='input-block'>
            { props.id && props.title && <label htmlFor={ props.id }>{ props.title }</label> }
            <textarea id={ props.id } name={ props.name } rows={ props.rows } defaultValue={ props.children } placeholder={ props.placeholder }></textarea>
        </div>
  );
}

Textarea.defaultProps = {
    rows: '5',
    placeholder: 'Введите текст',
};

export default Textarea