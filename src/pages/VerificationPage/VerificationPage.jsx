import React, { useState, useEffect } from 'react';
import { parsePhoneNumberFromString, formatIncompletePhoneNumber } from 'libphonenumber-js';
import { useToastManager } from '../../hooks/useToast';
import { useApi } from '../../hooks/useApi';
import Header from '../../components/Header/Header';
import Heading1 from '../../components/Barters/Heading/Heading1';
import Input from '../../components/Form/Input';
import Form from '../../components/Form/Form';
import api from '../../api/api';
import PopupValidatePhoneCode from '../../components/Popup/PopupValidatePhoneCode';

const VerificationPage = () => {
  const { showToast } = useToastManager();
  const { getUserIP } = useApi();

  const [errorMessage, setErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    const phoneNumber = parsePhoneNumberFromString(value);
    const formattedValue = formatIncompletePhoneNumber(value);

    setPhoneInput(formattedValue);

    if (phoneNumber && phoneNumber.isValid()) {
      setPhone(phoneNumber.number);
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);
    try {
      const ip = await getUserIP();
      console.log(ip)
      const result = await api.setUserAuthByPhoneCode({ phone: phone, ip: ip });
      if (result) {
        setIsPopupOpen(true);
        showToast(result.message, 'info');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitDisabled(false);
    }
  };

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='verification'>
        <Heading1 title='Верификация пользователя'>
          <div className='list-item'>
            <div className='list gap-xs'>
              <p>Чтобы пройти базовую верификацию, отправьте свой номер телефона в&nbsp;международном формате (напр. +79161234567) и&nbsp;дождитесь звонка.</p>
              <p>Во&nbsp;всплывающем окне введите последние 4&nbsp;цифры номера телефона входящего звонка.</p>
            </div>
          </div>
        </Heading1>
        <div className='list'>
          <div className='list-item'>
            <Form isDisabled={isSubmitDisabled} onSubmit={handleSubmitForm}>
              <Input
                id='phone'
                name='phone'
                title='Номер телефона'
                placeholder='+7 916 123-45-67'
                required='required'
                autoComplete='tel'
                value={phoneInput}
                onChange={handlePhoneInput}
                icon='phone'
                fade={true}
              />
            </Form>
          </div>
        </div>
      </div>
      <PopupValidatePhoneCode isOpen={isPopupOpen} onClose={() => { setIsPopupOpen(false) } } />
    </div>
  );
};

export default VerificationPage;