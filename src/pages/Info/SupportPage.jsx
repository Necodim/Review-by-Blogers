import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useToastManager } from '../../hooks/useToast';
import Form from '../../components/Form/Form';
import Select from '../../components/Form/Select';
import Textarea from '../../components/Form/Textarea';

const SupportPage = () => {
  const { sendSupportMessage } = api;
  const { isAvailable, showBackButton, user } = useTelegram();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  useEffect(() => {
    if (isAvailable) showBackButton();
  }, [isAvailable, showBackButton]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    setIsFormDisabled(!(subject !== '' && message.trim()));
  }, [subject, message]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    const data = `${subject}: ${message}`;

    try {
      const response = await sendSupportMessage({ message: data });
      if (!!response.message) {
        showToast(response.message, 'success');
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage('Ошибка при отправке сообщения, попробуйте снова');
      }
    } catch (error) {
      setErrorMessage(response.error);
    }
  }

  const selectOptions = [
    {
      label: 'Профиль',
      value: 'profile',
    },
    {
      label: 'Товары',
      value: 'products',
    },
    {
      label: 'Доставка',
      value: 'delivery',
    },
    {
      label: 'Бартеры',
      value: 'barters',
    },
    {
      label: 'Подписка',
      value: 'subscription',
    },
    {
      label: 'Ошибки и баги',
      value: 'error',
    },
    {
      label: 'Другое',
      value: 'other',
    }
  ];

  const handleSelectChange = (event) => {
    setSubject(event.target.value);
  }

  const handleTextareaChange = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className='content-wrapper'>
      <div className='container' id='support'>
        <div className='list'>
          <div className='list-item'>
            <h2>Поддержка</h2>
          </div>
          <div className='list-item'>
            <small>Напишите свой вопрос или предложение, мы&nbsp;ответим в&nbsp;ближайшее время</small>
          </div>
        </div>
        <Form onSubmit={handleSubmit} isDisabled={isFormDisabled} btntext='Отправить'>
          <Select
            id='subject'
            name='subject'
            placeholder='Выберите тему запроса'
            value={subject}
            options={selectOptions}
            onChange={handleSelectChange}
          />
          <Textarea
            id='question'
            name='question'
            placeholder='Задайте вопрос или напишите о неработающем функционале...'
            value={message}
            onChange={handleTextareaChange}
          />
        </Form>
      </div>
    </div>
  )
}

export default SupportPage;