import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../api/api';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';

const WaitingForCapturePage = () => {
  const navigate = useNavigate();
	const { getUserSubscription, getYookassaPaymentStatus } = api;
	const { updateProfile } = useUserProfile();
  const { showToast } = useToastManager();
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    setPaymentId(sessionStorage.getItem('paymentId'));
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        if (!paymentId) {
          throw new Error('Не найден ID платежа');
        }

        const response = await getYookassaPaymentStatus(paymentId);
        if (response.status === 'succeeded') {
          showToast('Платёж прошёл успешно!', 'success');
          sessionStorage.removeItem('paymentId');
					const addedSubscription = await getUserSubscription(response.id);
					if (!!addedSubscription) {
						const subscription = {
							active: !!addedSubscription,
							avaliable: new Date(addedSubscription.next_charge_date).getTime() - Date.now() > 0,
							expired_at: new Date(addedSubscription.next_charge_date).getTime()
						}
						updateProfile({subscription: subscription});
						showToast(`Вы подключили подписку. Сервис будет доступен до ${moment(subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
					} else {
						setErrorMessage('Ошибка при добавлении подписки. Перезайдите в приложение. Если подписка не появится, напишите в поддержку.');
					}
          navigate('/profile');
          clearInterval(intervalPaymentStatus);
        } else if (response.status === 'pending') {
          showToast('Платёж находится в обработке', 'loading');
        } else if (response.status === 'waiting_for_capture') {
          showToast('Платёж прошёл успешно, средства ожидают списания...', 'loading');
        } else if (response.status === 'canceled') {
          setErrorMessage('Платеж отменен. Это произошло, если вы отменили платеж самостоятельно, истекло время на принятие платежа или платеж был отклонен ЮКасса или платежным провайдером.')
          clearInterval(intervalPaymentStatus);
        } else {
          showToast('Неизвестный статус платежа. Свяжитесь с поддержкой.', 'info');
          clearInterval(intervalPaymentStatus);
        }
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

  return (
    <div className='content-wrapper'>
      <div className='container' id='waiting-for-capture'>
        <h1>Проверка платежа</h1>
        <div>Проверяем статус платежа. Пожалуйста, подождите...</div>
      </div>
    </div>
  );
}

export default WaitingForCapturePage;