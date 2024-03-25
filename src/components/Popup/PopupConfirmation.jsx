import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import Button from '../Button/Button';

const PopupConfirmation = ({ id, title, text, descr, isOpen, onClose, onConfirmation }) => {
    const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timeout = 4;
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
    }, [isOpen]);

    return (
        <Popup id={id} isOpen={isOpen} onClose={onClose}>
            <div className='list'>
                <div className='list-item vertical'>
                    <h2>{title}</h2>
                    <span>{text}</span>
                    {descr && <small>{descr}</small>}
                </div>
            </div>
            <div className='list'>
                <div className='list-item'>
                    <Button className='list-item' onClick={onClose}>Нет</Button>
                    <Button className={'list-item error' + (!isConfirmButtonEnabled ? ' disabled' : '')} onClick={onConfirmation}>{'Да' + (!isConfirmButtonEnabled && seconds > 0 ? ` (${seconds})` : '')}</Button>
                </div>
            </div>
        </Popup>
    );
};

PopupConfirmation.defaultProps = {
    id: 'popup-confirmation',
    title: 'Подтвердите действие',
    text: 'Вы уверены?',
};

export default PopupConfirmation;