import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';
import Link from '../Button/Link';
import Icon from '../Icon/Icon';

const Popup = ({ id, className, isOpen, onClose, children }) => {
  const popupRoot = document.getElementById('popup-root');

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget || event.target.parentNode === event.currentTarget) onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const popup = document.getElementById(id);
    if (popup) {
      const popupWrapper = popup.closest('.popup-background');
      if (isOpen && popupWrapper) {
        popupWrapper.classList.remove('closed');
      } else if (popupWrapper) {
        popupWrapper.classList.add('closed');
      }
    }
  }, [id, isOpen]);

  return ReactDOM.createPortal(
    <div className='popup-background closed' onClick={handleBackdropClick}>
      <div className='popup-wrapper'>
        <Link onClick={onClose}>
          <Icon icon='highlight_off' size='big' />
        </Link>
        <div id={id} className={'popup' + (className ? ' ' + className : '')} onClick={handleModalClick}>
          {children}
        </div>
      </div>
    </div>,
    popupRoot
  );
}

export default Popup;
