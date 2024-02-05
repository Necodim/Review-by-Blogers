import React from 'react';
import './Profile.css';
import { useTelegram } from '../../hooks/useTelegram';
import { getProfile } from '../../hooks/getProfile';
import { callback } from '../../hooks/callback';
import Form from '../Form/Form';
import Input from '../Form/Input';

const Subscribe = (props) => {
    const { showBackButton } = useTelegram();
    const { subscription } = getProfile();
    const { submitSubscribeCallback } = callback();
    
    showBackButton();

    if (subscription) {
        return (
            <div className='content-wrapper'>
                <div className='container' id='subscribe'>
                    <div className='list'>    
                        <div className='list-item'>
                            <h2>Оформление подписки</h2>
                        </div>
                    </div>
                    <div>У вас уже есть подписка</div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='content-wrapper'>
                <div className='container' id='subscribe'>
                    <div className='list'>    
                        <div className='list-item'>
                            <h2>Оформление подписки</h2>
                        </div>
                    </div>
                    <Form className='form-wrapper' btnicon='wallet' btntext='Оформить подписку' onSubmit={ submitSubscribeCallback }>
                        <Input id='subscribe-card-number' title='Номер карты' placeholder='2202 2032 0000 0000' />
                        <Input id='subscribe-card-period' title='Номер карты' placeholder='09/32' />
                        <Input id='subscribe-card-code' title='Номер карты' placeholder='123' />
                    </Form>
                </div>
            </div>
        )
    }
}

export default Subscribe