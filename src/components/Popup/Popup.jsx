import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';
import Link from '../Button/Link';
import Icon from '../Icon/Icon';

const Popup = ({ id, className, isOpen, onClose, children }) => {

  useEffect(() => {
    const app = document.querySelector('.app');
    const popupBackground = document.getElementById(id);
    if (isOpen && popupBackground) {
      popupBackground.classList.remove('closed');
      app.classList.add('overflow-hidden');
    } else if (popupBackground) {
      popupBackground.classList.add('closed');
      app.classList.remove('overflow-hidden');
      app.scrollIntoView();
    }
  }, [id, isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget || event.target.parentNode === event.currentTarget) onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  
  const popupRoot = document.getElementById('popup-root');

  return ReactDOM.createPortal(
    <div id={id} className='popup-background closed' onClick={handleBackdropClick}>
      <div className='popup-wrapper'>
        <Link onClick={onClose}>
          <Icon icon='highlight_off' size='big' />
        </Link>
        <div className={'popup' + (className ? ' ' + className : '')} onClick={handleModalClick}>
          {children}
        </div>
      </div>
    </div>,
    popupRoot
  );
}

export default Popup;
