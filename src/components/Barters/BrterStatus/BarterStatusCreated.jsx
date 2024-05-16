import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Button from '../../Button/Button';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import PopupOfferRefuseReason from '../../Popup/PopupOfferRefuseReason';

const BarterStatusCreated = ({ barter, updateBarter }) => {
  const { role } = useUserProfile();
  const { showToast } = useToastManager();
  
  const [errorMessage, setErrorMessage] = useState('');
  const [text, setText] = useState(null);
  const [blogger, setBlogger] = useState({});
  const [cardnumber, setCardnumber] = useState(null);
  const [formScreenshot, setFormScreenshot] = useState(null);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [btnRefuseDisabled, setBtnRefuseDisabled] = useState(false);
  const [isPopupRefuseOpen, setIsPopupRefuseOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText('Вы отправили предложение о бартере, но селлер ещё не принял его.');
        break;
      case 'seller':
        setText(`Блоггер отправил предложение о бартере. Ознакомьтесь с его профилем и, если вас всё устроит, отправьте средства для покупки товаров на карту.`);
        const fetchBlogger = async () => {
          try {
            const userId = barter.offer.user_id;
            const user = await api.getUserById(userId);
            setBlogger(user);
            if (blogger?.card_number) {
              const number = blogger.card_number.replace(/(\d{4})(?=\d)/g, '$1 ');
              setCardnumber(number);
            }
          } catch (error) {
            setErrorMessage(error.message);
          }
        }
        fetchBlogger();
        break;
    }
  }, [role, barter]);

  const handleChangeScreenshot = (file) => {
    setFile(file);
    setFileError(null);
  };

  const uploadScreenshot = async (formData) => {
    try {
      setFileLoading(true);
      setBtnRefuseDisabled(true);
      const response = await api.uploadReceipt(barter.id, formData);
      setFormScreenshot(response);
      return response;
    } catch (error) {
      const message = 'Ошибка при загрузке скриншота';
      console.error(`${message}:`, error);
      setFileError(message);
      throw Error('Не удалось загрузить изображение');
    } finally {
      setFileLoading(false);
      setBtnRefuseDisabled(false);
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
      setBtnRefuseDisabled(true);
      const uploadedFile = await uploadScreenshot(formData);
      setFormScreenshot(uploadedFile);
      const data = {
        barterId: barter.id,
        userId: barter.offer.userId,
        status: barter.offer.status,
        receipt: uploadedFile,
      }
      const updatedOffer = await api.updateBarterOffer(data);
      updateBarter(prevBarter => ({
        ...prevBarter,
        offer: {
          ...prevBarter.offer,
          status: updatedOffer.status,
          receipt_seller: uploadedFile,
        }
      }));
      showToast('Вы приняли предложение от блоггера', 'success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setFileLoading(false);
      setBtnRefuseDisabled(false);
    }
  };

  const openPopupRefuse = () => {
    setIsPopupRefuseOpen(true);
  }

  const closePopupRefuse = () => {
    setIsPopupRefuseOpen(false);
  }

  return (
    <div className='list'>
      <h2>Предложение создано</h2>
      <p>{text}</p>
      {(role === 'seller' && blogger) &&
        <div className='list gap-xl'>
          <div className='list-item vertical'>
            <Button className='w-100' target='_blank' icon='center_focus_strong'>Смотреть профиль</Button>
            <Input
              id='card-number'
              name='card-number'
              value={cardnumber}
              icon='content_copy'
              readOnly={true}
            />
          </div>
          <div className='list-item vertical'>
            <p>После чего подтвердите перевод средств.</p>
            <Form
              onSubmit={handleSubmit}
              isDisabled={fileLoading}
            >
              <Input
                type='file'
                id='receipt'
                name='receipt'
                title='Скриншот перевода *'
                value={formScreenshot}
                onChange={handleChangeScreenshot}
                required={true}
                error={fileError}
              />
            </Form>
          </div>
          <div className='list-item vertical'>
            <p>Или отклоните предложение</p>
            <Button className='error w-100' onClick={openPopupRefuse} disabled={btnRefuseDisabled}>Отклонить предложение</Button>
          </div>
          <PopupOfferRefuseReason
            isOpen={isPopupRefuseOpen}
            onClose={closePopupRefuse}
          />
        </div>
      }
    </div>
  );
}

export default BarterStatusCreated;