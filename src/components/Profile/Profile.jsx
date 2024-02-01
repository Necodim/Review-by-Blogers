import React from 'react';
import './Profile.css'
import { useTelegram } from '../../hooks/useTelegram'
import { getProfile } from '../../hooks/getProfile';
// import { Link, useLocation } from 'react-router-dom';
import Button from '../Button/Button';
import BrandsList from '../BrandList/BrandList';
import moment from 'moment';

const Profile = (props) => {
    const {showBackButton, showPopup, user} = useTelegram();
    const {subscription, subscriptionExpiration, api, trial, trialUsed} = getProfile();
    showBackButton();

    return (
        <div className='content-wrapper'>
            <div className='container' id='subscription' >
                <div className='list'>    
                    <div className='list-item'>
                        <h2>{ subscription ? 'Подписка' : 'Нет подписки' }</h2>
                        <Button onClick={showPopup} className='link'>Отменить</Button>
                    </div>
                    { subscriptionExpiration > new Date() && <div className='list-item'>{ 'до ' + moment(subscriptionExpiration).format('DD.MM.YYYY') }</div> }
                </div>
                <div className='list'>
                    { subscription && <Button className='list-item'>{ `${!!api ? 'Изменить' : 'Добавить'} API-ключ` }</Button> }
                    { !subscription && <Button className='list-item'>Оформить</Button> }
                    { !subscription && !trialUsed && <Button className='list-item'>Попробовать бесплатно</Button> }
                </div>
                {/* <span>{user?.username}</span> */}
            </div>
            { subscription && 
                <div className='container' id='brands' >
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Мои бренды</h2>
                            <small>10 товаров</small>
                        </div>
                    </div>
                    <BrandsList />
                </div>
            }
        </div>
    )
}

export default Profile