import React from 'react';
import Popup from '../Popup/Popup';
import Button from '../Button/Button';

const PopupEditProducts = ({ isOpen, onClose, onWriteTask }) => (
    <Popup id='popup-edit-products' isOpen={isOpen} onClose={onClose}>
        <div className='list'>
            <Button className='list-item vertical' onClick={onWriteTask}>Включить бартер</Button>
            <Button className='list-item vertical'>Выключить бартер</Button>
        </div>
    </Popup>
);

export default PopupEditProducts;