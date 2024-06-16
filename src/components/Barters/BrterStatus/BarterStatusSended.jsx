import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Form from '../../Form/Form';
import Input from '../../Form/Input';

const BarterStatusSended = ({ offer, updateOffer }) => {
  const { role } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('Средства отправлены');
  const [text, setText] = useState(null);
  const [formScreenshot, setFormScreenshot] = useState(null);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText('Подтвердите получение средств от селлера для покупки товаров, чтобы продолжить работу над бартером.');
        break;
      case 'seller':
        setText('Вы отправили средства для покупки товаров блогеру. Статус изменится, когда блогер подтвердит получение.');
        break;
    }
  }, [role]);

  const handleChangeScreenshot = (file) => {
    setFile(file);
    setFileError(null);
  };

  const uploadScreenshot = async (formData) => {
    try {
      setFileLoading(true);
      const response = await api.uploadReceipt(offer.barter.id, formData);
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
    if (!file) {
      setFileError('Выберите файл для загрузки');
      return
    }
    
    const formData = new FormData();
    formData.append('receipt', file);
    
    try {
      setFileLoading(true);
      const uploadedFile = await uploadScreenshot(formData);
      setFormScreenshot(uploadedFile);
      const data = {
        offerId: offer.id,
        status: offer.status,
        receipt: uploadedFile,
      }
      const updatedOffer = await api.updateBarterOffer(data);
      updateOffer(updatedOffer);
      showToast('Вы успешно отправили подтверждение. Статус бартера изменён.', 'success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div className='list'>
      <h1>{title}</h1>
      <p>{text}</p>
      {role === 'blogger' &&
        <Form
          onSubmit={handleSubmit}
          isDisabled={fileLoading}
          btntext='Подтвердить получение'
        >
          <Input
            type='file'
            id='receipt'
            name='receipt'
            title='Скриншот получения средств *'
            value={formScreenshot}
            onChange={handleChangeScreenshot}
            required={true}
            error={fileError}
          />
        </Form>
      }
    </div>
  );
}

export default BarterStatusSended;