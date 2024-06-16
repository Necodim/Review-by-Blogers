import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import Header from '../../components/Header/Header';
import Form from '../../components/Form/Form';
import Select from '../../components/Form/Select';
import Textarea from '../../components/Form/Textarea';
import Input from '../../components/Form/Input';

const SupportPage = () => {
  const { uploadImage, sendSupportMessage } = api;
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formScreenshot, setFormScreenshot] = useState('');
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    setIsFormDisabled(!(subject !== '' && message.trim()));
  }, [subject, message]);

  const handleSelectChange = (event) => {
    setSubject(event.target.value);
  }

  const handleTextareaChange = (event) => {
    setMessage(event.target.value);
  }

  const handleChangeScreenshot = (file) => {
    setFile(file);
    setFileError(null);
  };

  const uploadScreenshot = async (formData) => {
    try {
      setFileLoading(true);
      const response = await uploadImage(formData);
      setFormScreenshot(response);
      return response;
    } catch (error) {
      const message = 'Ошибка при загрузке скриншота';
      console.error(`${message}:`, error);
      setFileError(message);
      throw Error('Не удалось загрузить изображение');
    } finally {
      setFileLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFormDisabled(true);
    
    if (!message.trim()) return;
    const data = {
      message: `${subject}: ${message}`,
    }

    try {
      if (!!file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadedFile = await uploadScreenshot(formData);
        data.screenshot = uploadedFile;
      }

      const response = await sendSupportMessage(data);
      if (!!response.message) {
        showToast(response.message, 'success');
        setSubject('');
        setMessage('');
        document.querySelector('[name="screenshot"]').value = '';
        setFile(null);
        setFileError(null);
        setFormScreenshot('');
      } else {
        setErrorMessage('Ошибка при отправке сообщения, попробуйте снова');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsFormDisabled(false);
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

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='support'>
        <div className='list'>
          <div className='list-item'>
            <h1>Поддержка</h1>
          </div>
          <div className='list-item'>
            <small>Подробно опишите свой вопрос, предложение или проблему и&nbsp;приложите скриншот, если необходимо. Мы&nbsp;ответим в&nbsp;ближайшее время</small>
          </div>
        </div>
        <Form 
          onSubmit={handleSubmit}
          isDisabled={isFormDisabled || fileLoading}
          btntext='Отправить'
        >
          <Select
            id='subject'
            name='subject'
            title='Тема'
            placeholder='Выберите тему запроса'
            value={subject}
            options={selectOptions}
            onChange={handleSelectChange}
          />
          <Textarea
            id='question'
            name='question'
            title='Описание'
            placeholder='Задайте вопрос или напишите о неработающем функционале...'
            value={message}
            onChange={handleTextareaChange}
          />
          <Input
            type='file'
            id='screenshot'
            name='screenshot'
            title='Снимок экрана'
            value={formScreenshot}
            onChange={handleChangeScreenshot}
            error={fileError}
          />
        </Form>
      </div>
    </div>
  )
}

export default SupportPage;