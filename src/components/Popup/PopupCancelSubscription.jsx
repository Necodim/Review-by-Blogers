import React from 'react';
import moment from 'moment';
import Popup from "./Popup"
import Button from '../Button/Button';
import { useUserProfile } from '../../hooks/UserProfileContext';

const PopupCancelSubscription = (props) => {

    const { profile } = useUserProfile();

    const popupHeader = () => {
        return (
            <div className='list'>
                <div className='list-item'>
                    <h2>Отменить подписку</h2>
                </div>
            </div>
        )
    }

    const popupBody = () => {
        return (
            <div className='list'>
                <p className='list-item'>Вы уверены, что хотите отменить подписку? Это действие невозможно отменить.</p>
                <p className='list-item'>Вы не сможете пользоваться сервисом после истечения оплаченного срока действия ({moment(profile.subscription.expired_at).format('DD.MM.YYYY')}).</p>
                <p className='list-item'>После окончания срока действия все товары исчезнут и вы не будете получать предложения о бартере!</p>
            </div>
        )
    }

    const popupButton = () => {
        return (<Button className='error' onClick={props.onClick}>Отменить подписку</Button>)
    }

    return (
        <Popup id={props.id} isOpen={props.isOpen} onClose={props.onClose} {...props}>
            {popupHeader()}
            {popupBody()}
            {popupButton()}
        </Popup>
    )
}

export default PopupCancelSubscription