import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUserProfile } from './UserProfileContext';
import { useToastManager } from './useToast';
import api from '../api/api';

const checkout = YooMoneyCheckout(360975);

export const useYooKassa = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { showToast, resetLoadingToast } = useToastManager();

  const [idempotenceKey, setIdempotenceKey] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    setIdempotenceKey(uuidv4());
  }, []);

  const getYookassaConfirmationToken = async (period) => {
    try {
      const response = await api.getYookassaConfirmationToken(period);
      return response;
    } catch (error) {
      const message = 'Ошибка при попытке получения токена';
      console.error(`${message}:`, error);
      throw new Error(message);
    }
  }

  const getToken = async (cardData) => {
    console.log(cardData)
    console.log({
      number: cardData.number,
      cvc: cardData.cvc,
      month: cardData.month,
      year: cardData.year
    })

    try {
      const response = await checkout.tokenize({
        number: cardData.number,
        cvc: cardData.cvc,
        month: cardData.month,
        year: cardData.year
      });
      console.log(response)
      if (response.status === 'success') {
        const { paymentToken } = response.data.response;
        return paymentToken;
      }
      if (response.status === 'error') {
        if (response.error.message) {
          setErrorMessage(response.error.message);
        }
        const { params } = response.error;
        params.forEach(param => {
          setErrorMessage(param.message);
        });
      }
    } catch (error) {
      return error;
    }
  }

  const createYookassaPayload = async (cardData) => {
    showToast('Проводим оплату...', 'loading');
    setIdempotenceKey(uuidv4());
    try {
      const token = await getToken(cardData);
      return
      const data = {
        userId: profile.id,
        token: token,
        idempotenceKey: idempotenceKey
      }
      try {
        const payload = await api.createYookassaPayload(data);
        console.log(payload);
        sessionStorage.setItem('paymentId', payload.id);
        if (payload.status === 'pending') {
          window.location.href = payload.confirmation.confirmation_url;
        } else if (payload.status === 'waiting_for_capture') {
          try {
            const payment = await api.getYookassaPaymentStatus(payload.id);
            console.log(payment);
          } catch (error) {
            console.log(error);
            return error;
          }
        } else if (payload.status === 'succeeded') {
          resetLoadingToast();
          showToast('Платёж прошёл успешно!', 'success');
          navigate('/profile');
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  }

  return { createYookassaPayload, getYookassaConfirmationToken }
}