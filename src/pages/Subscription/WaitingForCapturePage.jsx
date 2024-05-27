import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';

const WaitingForCapturePage = () => {
    const navigate = useNavigate();
    const { showToast } = useToastManager();
    const { profile, updateProfile, updateUserData } = useUserProfile();

    const [errorMessage, setErrorMessage] = useState('');
    const [currentSubscription, setCurrentSubscription] = useState(profile.role);
    const [newSubscription, setNewSubscription] = useState(profile.role);

    useEffect(() => {
        const paymentId = sessionStorage.getItem('paymentId');
        
        const checkPaymentStatus = async () => {
            try {
                const response = await api.getYookassaPaymentStatus(paymentId);
                if (response.status === 'succeeded') {
                    showToast('Платёж прошёл успешно!', 'success');
                    sessionStorage.removeItem('paymentId');
                    navigate('/profile');
                    clearInterval(intervalPaymentStatus);
                } else if (response.status === 'pending') {
                    // Платеж еще не обработан, ждем
                } else {
                    // Обработка других статусов
                    clearInterval(intervalPaymentStatus);
                }
            } catch (error) {
                console.error(error);
                setErrorMessage('Произошла ошибка при оплате подписки');
                clearInterval(intervalPaymentStatus);
            }
        };

        const intervalPaymentStatus = setInterval(checkPaymentStatus, 10000);

        return () => clearInterval(intervalPaymentStatus);
    }, [navigate, showToast]);

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setErrorMessage('');
        }
    }, [errorMessage, showToast]);

    useEffect(() => {
        setCurrentSubscription(profile.subscription);
        setNewSubscription(profile.subscription);
    }, [profile.subscription]);

    // useEffect(async () => {
    //     try {
    //         await api.getYookassaPaymentStatus(paymentId)
    //     } catch (error) {
    //         console.log(error);
    //         setErrorMessage('Произошла ошибка при оплате подписки');
    //     }
    // }, [paymentId])

    const changeSubscription = async () => {
        const expiredDate = moment().add(30, 'days').valueOf();
        console.log(expiredDate)
        try {
            await updateUserData({ subscription: {active: true, avaliable: true, expired_at: expiredDate} });
            updateProfile({ subscription: {active: true, avaliable: true, expired_at: expiredDate} });
            showToast('Подписка успешно оформлена!', 'success');
            // navigate('/profile');
        } catch (error) {
            showToast('Ошибка при обновлении подписки', 'error');
        }
    } 

    return (
        <div className='content-wrapper'>
            <div className='container' id='waiting-for-capture'>
                <h2>Проверка платежа</h2>
                <div>Проверяем статус платежа. Пожалуйста, подождите...</div>
            </div>
        </div>
    )
}

export default WaitingForCapturePage;