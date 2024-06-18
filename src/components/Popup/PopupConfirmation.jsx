import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import Button from '../Button/Button';

const PopupConfirmation = ({ id, title, text, descr, isOpen, onClose, onConfirmation, timer, children }) => {
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!!timer) {
      const timeout = timer;
      if (isOpen) {
        setSeconds(timeout);
        const interval = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 0);
        }, 1000);

        const timer = setTimeout(() => {
          setIsConfirmButtonEnabled(true);
        }, timeout * 1000);

        return () => {
          clearInterval(interval);
          clearTimeout(timer);
          setIsConfirmButtonEnabled(false);
          setSeconds(0);
        };
      }
    } else {
      setIsConfirmButtonEnabled(false);
      setSeconds(0);
    }
  }, [isOpen, timer]);

  return (
    <Popup id={id || 'popup-confirmation'} isOpen={isOpen} onClose={onClose}>
      <div className='list'>
        <div className='list-item vertical'>
          <h1>{title || 'Подтвердите действие'}</h1>
          <span>{text || 'Вы уверены?'}</span>
          {descr && <small>{descr}</small>}
        </div>
      </div>
      {children}
      <div className='list'>
        <div className='list-item'>
          <Button className='list-item' onClick={onClose}>Нет</Button>
          <Button className={'list-item ' + (!timer ? 'success' : 'error' + (!isConfirmButtonEnabled ? ' disabled' : ''))} onClick={onConfirmation}>{'Да' + (!isConfirmButtonEnabled && seconds > 0 ? ` (${seconds})` : '')}</Button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupConfirmation;