import React, { useState } from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { callback } from '../../../hooks/callback';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Header from '../../Header/Header';

const SubscribeHasNoSubscription = (props) => {
    const [cardNumberValue, setCardNumberValue] = useState('');

    const { profile } = useUserProfile();
    const { submitSubscribeCallback } = callback();

    const handleCardNumberChange = (event) => {
        let { value } = event.target;
        value = value.replace(/\s+/g, '');
        const newValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumberValue(newValue);
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='subscribe'>
                <div className='list'>
                    <div className='list-item'>
                        <h2>Оформление подписки</h2>
                    </div>
                    <div className='list-item justify-content-start'>
                        <small>Стоимость:</small>
                        <span>10 000 ₽</span>
                    </div>
                </div>
                <Form className='form-wrapper' btnicon='wallet' btntext='Оформить подписку' onSubmit={submitSubscribeCallback}>
                    <Input
                        id='card-number'
                        name='card-number'
                        title='Номер карты'
                        placeholder={profile.card_number ? profile.card_number.replace(/(\d{4})(?=\d)/g, '$1 ') : '2202 2020 1234 5678'}
                        required='required'
                        value={cardNumberValue}
                        onChange={handleCardNumberChange}
                        maxLength='19'
                    />
                    <Input id='card-period' title='Номер карты' placeholder='09/32' />
                    <Input id='card-code' title='Номер карты' placeholder='123' />
                </Form>
            </div>
        </div>
    )
}

export default SubscribeHasNoSubscription