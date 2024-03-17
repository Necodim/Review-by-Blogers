import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import moment from 'moment';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram'
import { useHelpers } from '../../hooks/useHelpers';
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import BrandsList from '../BrandList/BrandList';
import PopupApi from '../Popup/PopupApi';
import PopupCancelSubscription from '../Popup/PopupCancelSubscription';

const ProfileSeller = () => {
    const { profile, cancelSubscription } = useUserProfile();
    const { isAvailable } = useTelegram();
    const { getPlural } = useHelpers();
    const { showToast, resetLoadingToast } = useToastManager();
    
    const [errorMessage, setErrorMessage] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isPopupApiOpen, setIsPopupApiOpen] = useState(false);
    const [isPopupCancelSubscriptionOpen, setIsPopupCancelSubscriptionOpen] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            resetLoadingToast();
            showToast(errorMessage, 'error');
        }
    }, [errorMessage, showToast]);
    
    const openPopupApi = () => setIsPopupApiOpen(true);
    const closePopupApi = () => setIsPopupApiOpen(false);
    const openPopupCancelSubscription = () => setIsPopupCancelSubscriptionOpen(true);
    const closePopupCancelSubscription = () => setIsPopupCancelSubscriptionOpen(false);

    const navigate = useNavigate();

    const goToSubscribe = () => {
        if (profile.subscription.active) showToast('У вас уже есть подписка', 'error');
        navigate('subscribe')
    }

    const startTrial = () => {
        if (profile.trial.active || profile.trial['barters-left'] === 0) {
            if (profile.trial.active) showToast(`Вы уже используете бесплатную версию. У вас осталось ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}.`, 'error');
            if (profile.trial['barters-left'] === 0) showToast(`Бесплатная версия предоставляется лишь 1 раз на 2 ${getPlural(2, 'бартер', 'бартера', 'бартеров')}. Чтобы дальше пользоваться сервисом, оформите подписку.`, 'error');
        }
    }

    const handlePopupApiSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = {};
        for (let [key, value] of formData.entries()) formValues[key] = value;
        showToast('Отправка данных...', 'loading');
        try {
            const result = await api.setApi(profile.id, formValues.api);
            if (result?.message) {
                showToast(result.message, 'success');
                closePopupApi();
            }
        } catch (error) {
            setErrorMessage('Произошла ошибка при получении списка товаров');
            console.error(`${error.message}:`, error);
             // для тестов
            tg ? tg.showAlert(error.message + '. Попробуйте ещё раз.') : alert(errorText);
        }
    };

    const cancellingSubscription = async () => {
        if (isAvailable()) {
            await cancelSubscription(); // проверить, когда будет роль seller

            // const fetchData = async () => {
            //     try {
            //         const result = await api.cancelSellerSubscription(profile.id);
            //         if (!!result && result.success && result.subscription) {
            //             showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
            //         } else if (!!result && !result.success && result.error) {
            //             showToast(result.error, 'error');
            //         } else {
            //             showToast('Произошла неизвестная ошибка', 'error');
            //         }
            //     } catch (error) {
            //         showToast(error, 'error');
            //     }
            // }
            // fetchData();

            // showPopup({
            //     title: 'Отменить подписку',
            //     message: `Вы уверены, что хотите отменить подписку? Вы не сможете пользоваться сервисом после истечения оплаченного срока действия (${moment(profile.subscription.expired_at).format('DD.MM.YYYY')})`,
            //     buttons: [
            //         { id: 'cancel_subscription', type: 'default', text: 'Да' },
            //         { type: 'cancel' },
            //     ]
            // }, function (btn) {
            //     if (btn === 'cancel_subscription') {
            //         Telegram.WebApp.openLink('https://ton.org/');
            //     }
            // });
        } else {
            showToast('Попап с предупреждением откроется только в TG', 'error');
        }
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='subscription' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>{profile.subscription.active ? 'Подписка' : profile.subscription.avaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробная версия' : 'Нет подписки'}</h2>
                        {profile.subscription.active ? <Link onClick={openPopupCancelSubscription}>Отменить</Link> : profile.subscription.avaliable ? '' : profile.trial['barters-left'] > 0 ? <small>{`Еще ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}`}</small> : ''}
                    </div>
                    {profile.subscription.avaliable && profile.subscription.expired_at > new Date().getTime() && <div className='list-item'>{profile.subscription.active ? 'Следующее списание ' : 'Сервис доступен до ' + moment(profile.subscription.expired_at).format('DD.MM.YYYY')}</div>}
                </div>
                <div className='list'>
                    {profile.subscription.avaliable && <Button className='list-item' onClick={openPopupApi}>{`${profile.api?.wildberries?.token ? 'Изменить' : 'Добавить'} API-ключ`}</Button>}
                    {!profile.subscription.active && <Button className='list-item' onClick={goToSubscribe}>Оформить</Button>}
                    {!profile.subscription.active && !profile.subscription.avaliable && !profile.trial.active && profile.trial['barters-left'] > 0 && <Button className='list-item' onClick={startTrial}>Попробовать бесплатно</Button>}
                </div>
            </div>
            {(profile.subscription.active || profile.subscription.avaliable) &&
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
            {(profile.subscription.active || profile.subscription.avaliable) && <PopupApi id='popup-api' isOpen={isPopupApiOpen} onClose={closePopupApi} onSubmit={handlePopupApiSubmit} />}
            {profile.subscription.active && <PopupCancelSubscription id='popup-cancel-subscription' isOpen={isPopupCancelSubscriptionOpen} onClose={closePopupCancelSubscription} onClick={cancellingSubscription} />}
        </div>
    );
};

export default ProfileSeller;