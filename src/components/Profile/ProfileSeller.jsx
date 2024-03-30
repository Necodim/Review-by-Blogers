import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import moment from 'moment';
import api from '../../api/api';
import { useHelpers } from '../../hooks/useHelpers';
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import BrandsList from '../BrandList/BrandList';
import PopupConfirmation from '../Popup/PopupConfirmation';
import PopupApi from './PopupApi.jsx';

const ProfileSeller = () => {
    const { profile, updateProfile, cancelSubscription } = useUserProfile();
    const { getPlural } = useHelpers();
    const { showToast } = useToastManager();
    
    const [errorMessage, setErrorMessage] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);
    const [isPopupApiOpen, setIsPopupApiOpen] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setErrorMessage('');
        }
    }, [errorMessage, showToast]);
    
    const openPopupApi = () => setIsPopupApiOpen(true);
    const closePopupApi = () => setIsPopupApiOpen(false);

    const navigate = useNavigate();

    const goToSubscribe = () => {
        if (profile.subscription?.active) showToast('У вас уже есть подписка', 'error');
        navigate('/profile/subscribe')
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
            const result = await api.setWildberriesApi(profile.id, formValues.api);
            if (result?.message) {
                updateProfile({
                    ...profile,
                    api: { ...profile.api, wildberries: { token: formValues.api } }
                });
                showToast(result.message, 'success');
                closePopupApi();
            }
        } catch (error) {
            setErrorMessage('Произошла ошибка при получении списка товаров');
            console.error(`${error.message}:`, error);
             // для тестов
            tg ? tg.showAlert(error.message + '. Попробуйте ещё раз.') : alert(errorText);
        }
    }

    const cancellingSubscription = async () => {
        const cancelledSubscription = await cancelSubscription();
        updateProfile({ ...profile, subscription: cancelledSubscription });
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='subscription' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>{profile.subscription?.active ? 'Подписка' : profile.subscription?.avaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробный период' : 'Нет подписки'}</h2>
                        {profile.subscription?.active ? <Link onClick={() => setIsPopupConfirmationOpen(true)}>Отменить</Link> : profile.subscription?.avaliable ? '' : profile.trial?.active && profile.trial['barters-left'] > 0 ? <small>{`Еще ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}`}</small> : ''}
                    </div>
                    {profile.subscription?.avaliable && profile.subscription?.expired_at > new Date().getTime() && <div className='list-item'>{(profile.subscription?.active ? 'Следующее списание ' : 'Сервис доступен до ') + moment(profile.subscription?.expired_at).format('DD.MM.YYYY')}</div>}
                </div>
                <div className='list'>
                    {profile.subscription?.avaliable && <Button className='list-item' onClick={openPopupApi}>{`${profile.api?.wildberries?.token ? 'Изменить' : 'Добавить'} API-ключ`}</Button>}
                    {!profile.subscription?.active && <Button className='list-item' onClick={goToSubscribe}>Оформить</Button>}
                    {!profile.subscription?.active && !profile.subscription?.avaliable && !profile.trial.active && profile.trial['barters-left'] > 0 && <Button className='list-item disabled' onClick={startTrial}>Попробовать бесплатно</Button>}
                </div>
            </div>
            {(profile.subscription?.active || profile.subscription?.avaliable) && profile.api.wildberries.token &&
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
            {profile.subscription?.active && <PopupConfirmation 
                id='popup-cancel-subscription'
                title='Отмена подписки' 
                text='Вы действительно хотите отменить подписку?' 
                descr={
                    <div className='list'>
                        <p className='list-item'>Это действие необратимо! Вы не&nbsp;сможете пользоваться сервисом после истечения оплаченного срока действия ({moment(profile.subscription?.expired_at).format('DD.MM.YYYY')}).</p>
                        <p className='list-item'>После окончания срока действия вы не&nbsp;будете получать предложения о&nbsp;бартер, но&nbsp;все ваши данные и&nbsp;товары сохранятся.</p>
                    </div>
                } 
                isOpen={isPopupConfirmationOpen} 
                onClose={() => setIsPopupConfirmationOpen(false)} 
                onConfirmation={cancellingSubscription} 
            />}
            {(profile.subscription?.active || profile.subscription?.avaliable) && <PopupApi id='popup-api' isOpen={isPopupApiOpen} onClose={closePopupApi} onSubmit={handlePopupApiSubmit} />}
        </div>
    );
};

export default ProfileSeller;