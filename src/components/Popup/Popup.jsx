import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';
import Button from '../Button/Button';

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


  let popupClass = ['popup'];
  if (className) popupClass.push(className);
  popupClass = popupClass.join(' ');

  return ReactDOM.createPortal(
    <div className='popup-background closed' onClick={handleBackdropClick}>
      <div className='popup-wrapper'>
        <Button onClick={onClose} className='link' icon='highlight_off' size='big'></Button>
        <div id={id} className={popupClass} onClick={handleModalClick}>
          {children}
        </div>
      </div>
    </div>,
    popupRoot
  );
}

export default Popup;
