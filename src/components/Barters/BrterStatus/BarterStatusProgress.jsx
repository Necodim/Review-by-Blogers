import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Form from '../../Form/Form';
import Input from '../../Form/Input';

const BarterStatusProgress = ({ barter, updateBarter }) => {
  const { role } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('Работа по бартеру началась');
  const [text, setText] = useState(null);
  const [formSending, setFormSending] = useState(false);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [formScreenshot, setFormScreenshot] = useState(null);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setTitle('Отчёт по бартеру №1');
        setText('Сделайте заказ товара на маркетплейсе, сделайте скриншот, подтверждающий факт заказа, а затем запланируйте рекламную кампанию с учётом времени доставки товара. После чего отправьте форму со скриншотом и датой.');
        break;
      case 'seller':
        setTitle('Работа по бартеру началась');
        setText('Блогер подтвердил факт получения средств. Скоро он добавит скриншот заказа товара и информацию о дате рекламной кампании.');
        break;
    }
  }, [role]);

  useEffect(() => {
    setFormScreenshot(barter?.offer?.screenshot);
  }, [barter])

  const handleChangeScreenshot = (file) => {
    setFile(file);
    setFileError(null);
  };

  const handleChangeDate = (e) => {
    setFormDate(e.target.value);
    setDateError(null);
  }

  const uploadScreenshot = async (formData) => {
    try {
      setFileLoading(true);
      console.log(barter)
      const response = await api.uploadBarterScreenshot(barter.id, formData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) setFileError('Выберите файл для загрузки');
    if (!formDate) setDateError('Укажите дату выхода reels');
    if (!file || !formDate) {
      return
    }
    setFormSending(true);

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const uploadedFile = await uploadScreenshot(formData);
      setFormScreenshot(uploadedFile);

      const data = {
        barterId: barter.id,
        offerId: barter.offer.id,
        status: barter.offer.status,
        screenshot: uploadedFile,
        date: formDate,
      }

      const updatedOffer = await api.updateBarterOffer(data);
      updateBarter(prevBarter => ({
        ...prevBarter,
        offer: updatedOffer
      }));
      showToast('Первый отчёт по бартеру отправлен', 'success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setFormSending(false);
    }
  };

  return (
    <div className='list'>
      <h2>{title}</h2>
      <p>{text}</p>
      {role === 'blogger' &&
        <Form
          onSubmit={handleSubmit}
          isDisabled={fileLoading || formSending}
        >
          <Input
            type='file'
            id='screenshot'
            name='screenshot'
            title='Скриншот заказа *'
            value={formScreenshot}
            onChange={handleChangeScreenshot}
            required={true}
            error={fileError}
          />
          <Input
            type='date'
            id='date'
            name='date'
            title='Дата рекламы *'
            placeholder={moment().format('DD.MM.YYYY')}
            value={formDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleChangeDate}
            error={dateError}
          />
        </Form>
      }
    </div>
  );
}

export default BarterStatusProgress;