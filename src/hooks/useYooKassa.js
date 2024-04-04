import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUserProfile } from './UserProfileContext';
import { useToastManager } from './useToast';
import api from '../api/api';

const checkout = YooMoneyCheckout(362812);

export const useYooKassa = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { showToast, resetLoadingToast } = useToastManager();

  const [idempotenceKey, setIdempotenceKey] = useState('');

  useEffect(() => {
    setIdempotenceKey(uuidv4());
  }, []);

  const getToken = async (cardData) => {
    try {
      const response = await checkout.tokenize({
        number: cardData.number,
        month: cardData.month,
        year: cardData.year,
        cvc: cardData.cvc
      });
      if (response.status === 'success') {
        const { paymentToken } = response.data.response;
        return paymentToken;
      }
      if (response.status === 'error') {
        const { params } = response.error;
        params.forEach(param => {
          setErrorMessage(param.message);
        });
      }
    } catch (error) {
      return error;
    }
  }

  const createPaymentPayload = async (cardData) => {
    showToast('Проводим оплату...', 'loading');
    setIdempotenceKey(uuidv4());
    try {
      const token = await getToken(cardData);
      const data = {
        userId: profile.id,
        token: token,
        idempotenceKey: idempotenceKey
      }
      try {
        const payload = await api.createPaymentPayload(data);
        console.log(payload);
        sessionStorage.setItem('paymentId', payload.id);
        if (payload.status === 'pending') {
          window.location.href = payload.confirmation.confirmation_url;
        } else if (payload.status === 'waiting_for_capture') {
          try {
            const payment = await api.getPaymentStatus(payload.id);
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

  return { createPaymentPayload }
}