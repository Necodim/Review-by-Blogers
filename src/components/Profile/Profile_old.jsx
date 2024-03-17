import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import moment from 'moment';
import api from '../../api/api.js';
import { useTelegram } from '../../hooks/useTelegram.js'
import { useHelpers } from '../../hooks/useHelpers.js';
import { useToastManager } from '../../hooks/useToast.js';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Header from '../Header/Header.jsx';
import Button from '../Button/Button.jsx';
import Link from '../Button/Link.jsx';
import BrandsList from '../BrandList/BrandList.jsx';
import PopupApi from '../Popup/PopupApi.jsx';
import PopupCancelSubscription from '../Popup/PopupCancelSubscription.jsx';
import Form from '../Form/Form.jsx';
import Input from '../Form/Input.jsx';


const Profile = (props) => {
    const { profile, updateProfile, cancelSubscription } = useUserProfile();
    const { setApi } = api;
    const { isAvailable } = useTelegram();
    const { getPlural } = useHelpers();
    const { showToast, resetLoadingToast } = useToastManager();
    
    const [totalProducts, setTotalProducts] = useState(0);
    const [isPopupApiOpen, setIsPopupApiOpen] = useState(false);
    const [isPopupCancelSubscriptionOpen, setIsPopupCancelSubscriptionOpen] = useState(false);
    const [cardNumberValue, setCardNumberValue] = useState('');
    
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

    const handlePopupApiSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = {};
        for (let [key, value] of formData.entries()) formValues[key] = value;
        submitApiCallback(formValues, closePopupApi);
        showToast('Отправка данных...', 'loading');

        setApi(userId, formValues.api)
            .then(res => {
                showToast(res.message, 'success');
                closePopupApi();
            })
            .catch(error => {
                showToast(error.message, 'error');
                console.error(`${error.message}:`, error);
                tg ? tg.showAlert(error.message + '. Попробуйте ещё раз.') : alert(errorText);
            });
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

    const profileBloggerSave = async (e) => {
        // if (isAvailable()) {
            e.preventDefault(); // Предотвращаем стандартную отправку формы
            const onboarding = profile.onboarding;
            // Получаем данные формы
            const formData = new FormData(e.target);
            let instagram = formData.get('instagram-username');
            if (instagram.includes('instagram.com/')) instagram = instagram.split('instagram.com/')[1].split('/')[0];
            if (instagram.includes('@')) instagram = instagram.split('@')[1];
            const data = {
                'card-number': parseInt(formData.get('card-number').replace(/\s/g, ''), 10),
                'instagram-username': instagram,
                'instagram-coverage': parseInt(formData.get('instagram-coverage'), 10),
                'onboarding': false,
            };
            await updateProfile(data);
            if (onboarding) {
                navigate('/blogger/store', { state: { showPopupAfterBloggerOnboarding: true } });
            } else {
                navigate('/blogger/store');
            }
            // const fetchData = async () => {
            //     try {
            //         const result = await api.updateUser(profile.id, data);
            //         if (result && result.success) {
            //             setLoading(false);
            //             const success = !!result.message ? result.message : 'Данные успешно сохранены';
            //             showToast(success, 'success');
            //             if (onboarding) {
            //                 navigate('/blogger/store', { state: { showPopupAfterBloggerOnboarding: true } });
            //             } else {
            //                 navigate('/blogger/store');
            //             }
            //             setProfile(true);
            //         } else if (result && result.error) {
            //             showToast(result.error, 'error');
            //         } else {
            //             showToast('Произошла неизвестная ошибка', 'error');
            //         }
            //     } catch (error) {
            //     showToast(error, 'error');
            //     }
            // }
            // fetchData();
        // } else {
        //     showToast('Редактирования профиля доступно только в Telegram', 'error');
        // }
    }

    const profileBloggerForm = () => {
        return <Form onSubmit={profileBloggerSave} btntext='Сохранить' btnicon='save'>
            <Input 
                id='card-number' 
                name='card-number' 
                title='Номер карты для переводов' 
                placeholder={profile.card_number ? profile.card_number.replace(/(\d{4})(?=\d)/g, '$1 ') : '2202 2020 1234 5678'} 
                required='required' 
                value={cardNumberValue} 
                onChange={handleCardNumberChange} 
                maxLength='19' 
            />
            <Input 
                id='instagram' 
                name='instagram-username' 
                title='Ссылка на ваш Instagram' 
                placeholder={profile.instagram.username ? 'https://www.instagram.com/' + profile.instagram.username : 'https://www.instagram.com/snezone'} 
                required='required' 
            />
            <Input 
                id='coverage' 
                type='number' 
                min='1000' 
                name='instagram-coverage' 
                title='Средние охваты reels' 
                placeholder={profile.instagram.coverage ? profile.instagram.coverage : 2000} 
                required='required' 
                onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/gi, '');
                }}
            />
        </Form>
    }

    const editBloggerProfile = (e) => {
        const list = e.target.closest('list');
        const hidden = list.querySelector('.form-wrapper.hidden');
    }

    const profileSeller = () => {
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
        )
    }
    
    const profileBlogger = () => {
        return (
            <div className='content-wrapper'>
                <Header />
                <div className='container' id='profile'>
                    <div className='list gap-l'>
                        <div className='list-item'>
                            <h2>{(profile.instagram.username && profile.instagram.coverage && profile.card_number) || !profile.onboarding ? 'Профиль' : 'Заполните профиль'}</h2>
                            {!profile.onboarding && <Link onClick={editBloggerProfile}>Редактировать</Link>}
                        </div>
                        <div className='list-item hidden form-wrapper'>
                            {profileBloggerForm()}
                        </div>
                        {profile.onboarding && 
                        <div className='list-item'>
                            <span>После регистрации напишите в Instagram <Link url='https://instagram.com/reviewbybloggers'>@reviewbybloggers</Link> кодовое слово RB для подтверждения профиля</span>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    if (profile.role === 'seller') {
        return profileSeller();
    } else if (profile.role === 'blogger') {
        return profileBlogger();
    }
}

export default Profile