import React from 'react';
import './Form.css'
import Icon from '../Icon/Icon';

const Input = (props) => {
    const inputIcon = () => {
        let iconWrapperClassname = 'icon-wrapper';
        iconWrapperClassname = props.iconcallback ? [iconWrapperClassname, 'clickable'].join(' ') : '';
        
        if (!!props.icon) {
            return (
                <div className={ iconWrapperClassname } onClick={ props.iconcallback }>
                    <Icon icon={ props.icon } />
                </div>
            )
        } else {
            return false;
        }
    }

    return (
        <div id={ 'input-block-' + props.id } className='input-block'>
            { props.title && <label htmlFor={ props.id }>{ props.title }</label> }
            <div className='input-wrapper'>
                <input type={ props.type } id={ props.id } placeholder={ props.placeholder } />
                { props.fade && <div className='input-fade' /> }
                { inputIcon() }
            </div>
        </div>
  );
}

Input.defaultProps = {
    type: 'text',
    placeholder: 'Текст',
};

export default Input