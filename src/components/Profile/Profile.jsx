import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import moment from 'moment';
import { useTelegram } from '../../hooks/useTelegram'
import { useUserProfile } from '../../UserProfileContext';
import { getProfile } from '../../hooks/getProfile';
import Preloader from '../Preloader/Preloader';
import Header from '../Header/Header';
import Button from '../Button/Button';
import BrandsList from '../BrandList/BrandList';
import PopupApi from '../Popup/PopupApi';

const Profile = (props) => {
    const { profile, loading } = useUserProfile();
    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    }

    const { showPopup } = useTelegram();
    const { subscription, subscriptionExpiration, trial, trialUsed } = getProfile();

    const [isPopupOpen, setIsModalOpen] = useState(false);
    const openPopupApi = () => setIsModalOpen(true);
    const closePopupApi = () => setIsModalOpen(false);

    const navigate = useNavigate();

    const goToSubscribe = () => {
        navigate('subscribe')
    }

    const cancelSubscription = () => {
        showPopup({
            title: 'Отменить подписку',
            message: `Вы уверены, что хотите отменить подписку? Вы не сможете пользоваться сервисом после истечения оплаченного срока действия (${moment(subscriptionExpiration).format('DD.MM.YYYY')})`,
            buttons: [
                { id: 'cancel_subscription', type: 'default', text: 'Да' },
                { type: 'cancel' },
            ]
        }, function (btn) {
            if (btn === 'cancel_subscription') {
                Telegram.WebApp.openLink('https://ton.org/');
            }
        });
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='subscription' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>{subscription ? 'Подписка' : trial ? 'Пробная версия' : 'Нет подписки'}</h2>
                        { subscription ? <Button onClick={cancelSubscription} className='link'>Отменить</Button> : trial ? <span>Еще N бартер(-ов)</span> : '' }
                    </div>
                    { subscription && subscriptionExpiration > new Date() && <div className='list-item'>{'до ' + moment(subscriptionExpiration).format('DD.MM.YYYY')}</div> }
                </div>
                <div className='list'>
                    {subscription && <Button className='list-item' onClick={openPopupApi}>{`${profile.api ? 'Изменить' : 'Добавить'} API-ключ`}</Button>}
                    {!subscription && <Button className='list-item' onClick={goToSubscribe}>Оформить</Button>}
                    {!subscription && !trial && !trialUsed && <Button className='list-item'>Попробовать бесплатно</Button>}
                </div>
            </div>
            {subscription &&
                <div className='container' id='brands' >
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Мои бренды</h2>
                            <small>Сумма товаров</small>
                        </div>
                    </div>
                    <BrandsList />
                </div>
            }
            {subscription && <PopupApi isOpen={isPopupOpen} onClose={closePopupApi} />}
        </div>
    )
}

export default Profile