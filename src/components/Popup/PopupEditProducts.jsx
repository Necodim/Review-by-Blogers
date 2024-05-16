import React from 'react';
import Popup from './Popup';
import Button from '../Button/Button';

const PopupEditProducts = ({ isOpen, onClose, onBarterOpen }) => (
    <Popup id='popup-edit-products' isOpen={isOpen} onClose={onClose}>
        <div className='list'>
            <Button className='list-item vertical' onClick={onBarterOpen} icon='add'>Открыть бартер</Button>
            <Button className='list-item vertical' icon='cancel'>Закрыть бартер</Button>
        </div>
    </Popup>
);

export default PopupEditProducts;