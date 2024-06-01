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
	const [paymentId, setPaymentId] = useState(null);
	const [currentSubscription, setCurrentSubscription] = useState(profile.role);
	const [newSubscription, setNewSubscription] = useState(profile.role);

	useEffect(() => {
		setPaymentId(sessionStorage.getItem('paymentId'));
	}, [])

	useEffect(() => {
		const checkPaymentStatus = async () => {
			try {
				if (!paymentId) {
					throw new Error('Не найден ID платежа');
				}

				const response = await api.getYookassaPaymentStatus(paymentId);
				if (response.status === 'succeeded') {
					showToast('Платёж прошёл успешно!', 'success');
					sessionStorage.removeItem('paymentId');
					navigate('/profile');
				} else if (response.status === 'pending') {
					showToast('Платёж находится в обработке', 'loading');
				} else if (response.status === 'waiting_for_capture') {
					showToast('Платёж прошёл успешно, деньги авторизованы и ожидают списания...', 'loading');
				} else if (response.status === 'canceled') {
					setErrorMessage('Платеж отменен. Это произошло, если вы отменили платеж самостоятельно, истекло время на принятие платежа или платеж был отклонен ЮKassa или платежным провайдером.')
				} else {
					showToast('Неизвестный статус платежа. Свяжитесь с поддержкой.', 'info');
				}
				clearInterval(intervalPaymentStatus);
			} catch (error) {
				console.error(error);
				setErrorMessage('Произошла ошибка при оплате подписки. Если средства списались, обратитесь в поддержку.');
				clearInterval(intervalPaymentStatus);
			}
		};

		const intervalPaymentStatus = setInterval(checkPaymentStatus, 5000);

		return () => clearInterval(intervalPaymentStatus);
	}, [paymentId, navigate, showToast]);

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
			await updateUserData({ subscription: { active: true, avaliable: true, expired_at: expiredDate } });
			updateProfile({ subscription: { active: true, avaliable: true, expired_at: expiredDate } });
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