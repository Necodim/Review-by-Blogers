import React from 'react';
import './Form.css'

const Textarea = (props) => {
    return (
        <div id={ 'input-block-' + props.id } className='input-block'>
            { props.id && props.title && <label htmlFor={ props.id }>{ props.title }</label> }
            <textarea id={ props.id } name={ props.name } rows={ props.rows } value={ props.value } placeholder={ props.placeholder }></textarea>
        </div>
  );
}

Textarea.defaultProps = {
    rows: '5',
    value: '',
    placeholder: 'Введите текст',
};

export default Textarea