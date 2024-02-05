import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../Popup/Popup.css'
import Button from '../Button/Button';

const Toast = ({ isOpen, onClose, children }) => {
  const toastRoot = document.getElementById('toast-root');

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const toastWrapper = document.querySelector('.toast-background');
    if (isOpen) {
      toastWrapper.classList.remove('closed');
      setTimeout(onClose, 3000);
    } else {
      toastWrapper.classList.add('closed');
      setTimeout(() => {
        return null;
      }, 300);
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div className='toast-background closed' onClick={ handleBackdropClick }>
      <div className=' toast-wrapper'>
        <Button onClick={onClose} className='link' icon='highlight_off' size='big'></Button>
        <div className='toast' onClick={ handleModalClick }>
          {children}
        </div>
      </div>
    </div>,
    toastRoot
  );
}

export default Toast