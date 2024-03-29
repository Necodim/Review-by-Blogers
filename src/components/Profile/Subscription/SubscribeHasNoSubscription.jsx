import React, { useEffect, useState } from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Header from '../../Header/Header';

const SubscribeHasNoSubscription = () => {
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttemptedSubmit(true);

    if (!cardNumberValue || !cardPeriodValue || !cardCodeValue) {
      setErrorMessage('Все поля должны быть заполнены.');
      return;
    }

    // Проверяем формат и валидность даты срока действия карты
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

    // submitSubscribeCallback();
  }

  // const submitSubscribeCallback = async () => {
  //     const cardNumber = cardNumberValue.replace('/\D/g', '');
  //     const data = {
  //         number: cardNumber,
  //         period: cardPeriodValue,
  //         code: cardCodeValue
  //     }
  //     await sendCardData(profile.id, data);
  //     showToast('Формируем платежный терминал', 'info');
  // }

  // const sendCardData = async (data) => {
  //     await console.log(data);
  // }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='subscribe'>
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
            autocomplete='cc-number'
            value={cardNumberValue}
            onChange={handleCardNumberChange}
            maxLength='19'
          />
          <Input
            id='card-period'
            name='card-period'
            title='Действительна до'
            placeholder='09/32'
            value={cardPeriodValue}
            onChange={handleCardPeriodChange}
            maxLength='5'
          />
          <Input
            id='card-code'
            name='card-code'
            title='CVC/CVV код'
            placeholder='123'
            value={cardCodeValue}
            onChange={handleCardCodeChange}
            maxLength='3'
          />
        </Form>
      </div>
    </div>
  )
}

export default SubscribeHasNoSubscription