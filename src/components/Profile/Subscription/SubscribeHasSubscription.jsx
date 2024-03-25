import React from 'react';
import '../Profile.css';
import Header from '../../Header/Header';

const SubscribeHasSubscription = () => {
    return (
        <div className='content-wrapper'>
            <Header />
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
}

export default SubscribeHasSubscription