import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css'
import Button from '../Button/Button';

const Popup = ({ isOpen, onClose, children }) => {
  const popupRoot = document.getElementById('popup-root');

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget || event.target.parentNode === event.currentTarget) onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const popupWrapper = document.querySelector('.popup-background');
    if (isOpen) {
      popupWrapper.classList.remove('closed');
    } else {
      popupWrapper.classList.add('closed');
      setTimeout(() => {
        return null;
      }, 300);
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div className='popup-background closed' onClick={ handleBackdropClick }>
      <div className='popup-wrapper'>
        <Button onClick={onClose} className='link' icon='highlight_off' size='big'></Button>
        <div className='popup' onClick={ handleModalClick }>
          {children}
        </div>
      </div>
    </div>,
    popupRoot
  );
}

export default Popup