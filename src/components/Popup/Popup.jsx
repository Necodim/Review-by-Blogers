import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';
import Link from '../Button/Link';
import Icon from '../Icon/Icon';

const Popup = ({ id, className, isOpen, onClose, children }) => {

  useEffect(() => {
    const initialHeight = window.innerHeight;

    function handleResize() {
      const newHeight = window.innerHeight;
      const difference = initialHeight - newHeight;
      if (difference > 0) {
        setKeyboardHeight(difference);
      } else {
        setKeyboardHeight(0);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget || event.target.parentNode === event.currentTarget) onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  
  const popupRoot = document.getElementById('popup-root');

  return ReactDOM.createPortal(
    <div className='popup-background closed' onClick={handleBackdropClick} style={{ marginBottom: keyboardHeight }}>
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
