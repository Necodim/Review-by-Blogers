import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import moment from 'moment';
import { useTelegram } from '../../hooks/useTelegram'
import { useHelpers } from '../../hooks/useHelpers';
import { useUserProfile } from '../../UserProfileContext';
import { getProfile } from '../../hooks/getProfile';
import { callback } from '../../hooks/callback.js';
import { useToastManager } from "../../hooks/useToast";
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

    const { isAvailable, showPopup } = useTelegram();
    const { getPlural } = useHelpers();
    const { subscription, subscriptionExpiration, trial, trialUsed } = getProfile();
    const { submitApiCallback } = callback();
    const { showToast, resetLoadingToast } = useToastManager();
    
    const [totalProducts, setTotalProducts] = useState(0);
    const [isPopupOpen, setIsModalOpen] = useState(false);
    const openPopupApi = () => setIsModalOpen(true);
    const closePopupApi = () => setIsModalOpen(false);

    const navigate = useNavigate();

    const goToSubscribe = () => {
        if (subscription) showToast('У вас уже есть подписка', 'error');
        navigate('subscribe')
    }

    const startTrial = () => {
        if (trial || trialUsed) {
            if (trial) showToast(`Вы уже используете бесплатную версию. У вас осталось 2 ${getPlural(2, 'бартер', 'бартера', 'бартеров')}.`, 'error');
            if (trialUsed) showToast(`Бесплатная версия предоставляется лишь 1 раз на 2 ${getPlural(2, 'бартер', 'бартера', 'бартеров')}. Чтобы дальше пользоваться сервисом, оформите подписку.`, 'error');
        }
    }

    const cancelSubscription = () => {
        if (isAvailable()) {
            // showPopup({
            //     title: 'Отменить подписку',
            //     message: `Вы уверены, что хотите отменить подписку? Вы не сможете пользоваться сервисом после истечения оплаченного срока действия (${moment(subscriptionExpiration).format('DD.MM.YYYY')})`,
            //     buttons: [
            //         { id: 'cancel_subscription', type: 'default', text: 'Да' },
            //         { type: 'cancel' },
            //     ]
            // }, function (btn) {
            //     if (btn === 'cancel_subscription') {
            //         Telegram.WebApp.openLink('https://ton.org/');
            //     }
            // });
            showToast('Ага, как же', 'error');
        } else {
            showToast('Попап с предупреждением откроется только в TG', 'error');
        }
    }

    const handleSubmit = (formValues) => {
        submitApiCallback(formValues, closePopupApi);
    };

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='subscription' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>{subscription ? 'Подписка' : trial ? 'Пробная версия' : 'Нет подписки'}</h2>
                        {subscription ? <Button onClick={cancelSubscription} className='link'>Отменить</Button> : trial ? <small>Еще 2 {getPlural(2, 'бартер', 'бартера', 'бартеров')}</small> : ''}
                    </div>
                    {subscription && subscriptionExpiration > new Date() && <div className='list-item'>{'до ' + moment(subscriptionExpiration).format('DD.MM.YYYY')}</div>}
                </div>
                <div className='list'>
                    {subscription && <Button className='list-item' onClick={openPopupApi}>{`${profile.api ? 'Изменить' : 'Добавить'} API-ключ`}</Button>}
                    {!subscription && <Button className='list-item' onClick={goToSubscribe}>Оформить</Button>}
                    {!subscription && !trial && !trialUsed && <Button className='list-item' onClick={startTrial}>Попробовать бесплатно</Button>}
                </div>
            </div>
            {subscription &&
                <div className='container' id='brands' >
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Мои бренды</h2>
                            <small>{`${totalProducts} ${getPlural(totalProducts, 'товар', 'товара', 'товаров')}`}</small>
                        </div>
                    </div>
                    <BrandsList setTotalProducts={setTotalProducts} />
                </div>
            }
            {subscription && <PopupApi isOpen={isPopupOpen} onClose={closePopupApi} onSubmit={handleSubmit} />}
        </div>
    )
}

export default Profile