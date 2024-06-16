import React, { useEffect, useState } from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import { useYooKassa } from '../../../hooks/useYooKassa';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Header from '../../Header/Header';
import api from '../../../api/api';
import PreloaderContainer from '../../Preloader/PreloaderContainer';

const SubscribeHasNoSubscription = ({ period }) => {
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();
  const { createYookassaPayload, getYookassaConfirmationToken } = useYooKassa();

  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    'card-number': '',
    'card-period': '',
    'card-code': ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [cardNumberValue, setCardNumberValue] = useState('');
  const [cardPeriodValue, setCardPeriodValue] = useState('');
  const [cardCodeValue, setCardCodeValue] = useState('');
  const [token, setToken] = useState(null);
  const [loadingText, setLoadingText] = useState('Получение токена для оплаты.');

  useEffect(() => {
    const fetchToken = async () => {
      setLoadingText('Загрузка платёжного виджета.');
      try {
        const response = await getYookassaConfirmationToken(period);
        sessionStorage.setItem('paymentId', response.id);
        const token = response.confirmation.confirmation_token;
        setToken(token);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoadingText('Ещё пару секунд...');
      }
    };

    if (!!period) {
      fetchToken();
    }
  }, [period]);

  useEffect(() => {
    if (!token) {
      return;
    } else {
      const script = document.createElement('script');
      script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
      script.async = true;
  
      const getParams = (token) => {
        return {
          confirmation_token: token,
          return_url: 'http://reviewbybloggers.ru/profile/subscription/subscribe/waiting-for-capture',
          customization: {
            colors: {
              control_primary: '#47a7ff',
              control_primary_content: '#ffffff',
              text: '#ffffff',
              background: '#1C4366',
              border: '#1C4366',
              // control_secondary: '',
            }
          },
          error_callback: function (error) {
            console.log(error);
          }
        };
      };
  
      const prepareWidget = async () => {
        const params = getParams(token);
  
        script.onload = () => {
          setLoadingText('');
          const checkout = new window.YooMoneyCheckoutWidget(params);
          document.getElementById('payment-form').innerHTML = '';
          checkout.render('payment-form');
        };
  
        document.body.appendChild(script);
      };
  
      prepareWidget();
  
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [token]);

  useEffect(() => {
    if (errorMessage && attemptedSubmit) {
      setAttemptedSubmit(false);
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, attemptedSubmit, showToast]);

  useEffect(() => {
    const keys = Object.keys(formData);
    let array = new Array();
    for (let field of keys) {
      if (formData[field].trim() === '') array.push(true);
    }
    const isValid = array.length === 0;
    setIsFormValid(isValid);
  }, [formData]);

  const addFormData = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleCardNumberChange = (event) => {
    setAttemptedSubmit(false);
    let { name, value } = event.target;
    value = value.replace(/\D+/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumberValue(value);
    addFormData(name, value);
  }

  const handleCardPeriodChange = (event) => {
    setAttemptedSubmit(false);
    let { name, value } = event.target;
    value = value.replace(/\D+/g, '');
    value = value.replace(/(\d{2})(?=\d)/g, '$1/');
    setCardPeriodValue(value);
    addFormData(name, value);
  }

  const handleCardCodeChange = (event) => {
    setAttemptedSubmit(false);
    let { name, value } = event.target;
    value = value.replace(/\D+/g, '');
    setCardCodeValue(value);
    addFormData(name, value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    setIsFormValid(false);

    if (!cardNumberValue || !cardPeriodValue || !cardCodeValue) {
      setErrorMessage('Все поля должны быть заполнены.');
      return;
    }

    const periodParts = cardPeriodValue.split('/');
    if (periodParts.length !== 2) {
      setErrorMessage('Неверный формат срока действия карты');
      return;
    }

    const month = parseInt(periodParts[0], 10);
    const year = parseInt(periodParts[1], 10) + 2000;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      setErrorMessage('Месяц должен быть в диапазоне от 01 до 12');
      return;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setErrorMessage('Срок действия карты истёк, попробуйте использовать другую карту');
      return;
    }

    const cardData = {
      number: cardNumberValue.replace(/\D/gi, ''),
      month: periodParts[0],
      year: periodParts[1],
      cvc: cardCodeValue
    }

    try {
      const payment = await createYookassaPayload(cardData);
    } catch (error) {
      setIsFormValid(true);
      console.log(error);
    }
  }

  if (!!loadingText) {
    return <PreloaderContainer text={loadingText} />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {/* <div className='container' id='subscribe'>
        <div className='list'>
          <div className='list-item'>
            <h2>Оформление подписки</h2>
          </div>
          <div className='list-item justify-content-start'>
            <small>Стоимость:</small>
            <span>10 000 ₽</span>
          </div>
        </div>
        <Form className='form-wrapper' btnicon='wallet' btntext='Оформить подписку' isDisabled={!isFormValid} onSubmit={handleSubmit}>
          <Input
            id='card-number'
            name='card-number'
            title='Номер карты'
            placeholder='2202 2020 1234 5678'
            required='required'
            autoComplete='cc-number'
            value={cardNumberValue}
            onChange={handleCardNumberChange}
            maxLength='19'
          />
          <Input
            id='card-period'
            name='card-period'
            title='Действительна до'
            placeholder='09/32'
            required='required'
            autoComplete='cc-exp'
            value={cardPeriodValue}
            onChange={handleCardPeriodChange}
            maxLength='5'
          />
          <Input
            id='card-code'
            name='card-code'
            title='CVC/CVV код'
            placeholder='123'
            required='required'
            autoComplete='cc-csc'
            value={cardCodeValue}
            onChange={handleCardCodeChange}
            maxLength='3'
          />
        </Form>
      </div> */}
      <div id="payment-form"></div>
    </div>
  )
}

export default SubscribeHasNoSubscription