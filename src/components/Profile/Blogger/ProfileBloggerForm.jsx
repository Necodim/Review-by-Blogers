import React, { useEffect, useState } from 'react';
import { useToastManager } from '../../../hooks/useToast.js';
import { useUserProfile } from '../../../hooks/UserProfileContext.js';
import Form from '../../Form/Form.jsx';
import Input from '../../Form/Input.jsx';

const ProfileBloggerForm = () => {
  const { profile, updateUserData } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    'card-number': '',
    'instagram-username': '',
    'instagram-coverage': ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [cardNumberValue, setCardNumberValue] = useState('');
  const [instagramValue, setInstagramValue] = useState('');
  const [coverageValue, setCoverageValue] = useState('');

  useEffect(() => {
    if (errorMessage && attemptedSubmit) {
      showToast(errorMessage, 'error');
      setAttemptedSubmit(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    const onboarding = profile.onboarding;
    const formData = new FormData(event.target);

    const cardNumber = parseInt(formData.get('card-number').replace(/\s/g, ''), 10);
    if (String(cardNumber).length < 16 || String(cardNumber).length > 19) {
      setErrorMessage('Введите корректный номер карты');
      return false;
    }
    let instagram = formData.get('instagram-username');
    instagram = instagram.split('?')[0];
    if (instagram.includes('instagram.com/')) instagram = instagram.split('instagram.com/')[1].split('/')[0];
    if (instagram.includes('@')) instagram = instagram.split('@')[1];
    if (instagram.length < 3) {
      setErrorMessage('Введите корректный аккаунт Instagram');
      return false;
    }

    const coverage = parseInt(formData.get('instagram-coverage'), 10);
    if (coverage < 1000) {
      setErrorMessage('Мы берём блогеров с охватом от 1000');
      return false;
    }

    const data = {
      'card-number': cardNumber,
      'instagram-username': instagram,
      'instagram-coverage': coverage,
      'onboarding': false,
    };
    await updateUserData(data);
    if (onboarding) {
      navigate('/store', { state: { showPopupAfterBloggerOnboarding: true } });
    } else {
      navigate('/store');
    }
  }

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

  const handleInstagramChange = (event) => {
    setAttemptedSubmit(false);
    const { name, value } = event.target;
    setInstagramValue(value);
    addFormData(name, value);
  }

  const handleCoverageChange = (event) => {
    setAttemptedSubmit(false);
    let { name, value } = event.target;
    value = value.replace(/\D/g, '');
    setCoverageValue(value);
    addFormData(name, value);
  }

  return (
    <Form onSubmit={handleSubmit} btntext='Сохранить' btnicon='save' isDisabled={!isFormValid}>
      <Input
        id='card-number'
        name='card-number'
        title='Номер карты для переводов'
        placeholder={profile.card_number ? profile.card_number.replace(/(\d{4})(?=\d)/g, '$1 ') : '2202 2020 1234 5678'}
        required='required'
        autoComplete='cc-number'
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
        value={instagramValue}
        onChange={handleInstagramChange}
      />
      <Input
        id='coverage'
        type='number'
        min='1000'
        name='instagram-coverage'
        title='Средние охваты reels'
        placeholder={profile.instagram.coverage ? profile.instagram.coverage : 2000}
        required='required'
        value={coverageValue}
        onChange={handleCoverageChange}
      />
    </Form>
  );
};

export default ProfileBloggerForm;