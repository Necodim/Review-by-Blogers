import React, { useEffect, useState } from 'react';
import Button from '../../Button/Button';
import PopupTaskRead from '../../Popup/PopupTaskRead';
import PopupConfirmation from '../../Popup/PopupConfirmation';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';

const ProductPageBloggerActions = ({ selectedProducts }) => {
  const { showToast, resetLoadingToast } = useToastManager();

  const [ errorMessage, setErrorMessage ] = useState('');
  const [ product, setProduct ] = useState({});
  const [ canMakeOffer, setCanMakeOffer ] = useState(true);
  const [ isPopupTaskReadVisible, setIsPopupTaskReadVisible ] = useState(false);
  const [ isPopupConfirmationBarterOfferVisible, setIsPopupConfirmationBarterOfferVisible ] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    setProduct(selectedProducts[0]);
    const offersStorage = sessionStorage.getItem('offers');
    if (!!offersStorage) {
      const array = JSON.parse(offersStorage);
      setCanMakeOffer(array.indexOf(selectedProducts[0].barter.id) === -1);
    } else if (selectedProducts[0].barter?.offer?.id) {
      saveOfferToSessionStorage(selectedProducts[0].barter.id);
    }
  }, [selectedProducts])

  const openPopupTaskRead = () => {
    setIsPopupTaskReadVisible(true);
  }

  const openPopupConfirmation = () => {
    setIsPopupConfirmationBarterOfferVisible(true);
  }

  const saveOfferToSessionStorage = (barterId) => {
    const offersStorage = sessionStorage.getItem('offers');
    let array;
    if (!!offersStorage) {
      array = JSON.parse(offersStorage)
      array.push(barterId);
    } else {
      array = [barterId]
    }
    array = [...new Set(array)];
    sessionStorage.setItem('offers', JSON.stringify(array));
  }

  const offerBarter = async () => {
    setIsPopupConfirmationBarterOfferVisible(false);
    setCanMakeOffer(false);
    showToast('Отправляем предложение...', 'loading');
    const data = {
      barterId: product.barter.id,
      details: ''
    }

    try {
      const result = await api.createBarterOffer(data);
      showToast(result.message, 'success');
      setCanMakeOffer(false);
      saveOfferToSessionStorage(data.barterId);
    } catch (error) {
      const message = error.message || 'Не удалось отправить предложение о бартере. Попробуйте ещё раз.';
      if (message === 'Предложение бартера уже существует.') {
        setCanMakeOffer(false);
        saveOfferToSessionStorage(data.barterId);
      } else {
        setCanMakeOffer(true);
      }
      setErrorMessage(message);
      console.error(error);
    } finally {
      resetLoadingToast();
    }
  }

  return (
    <>
      <div className='w-100'>
        <div className='list'>
          <div className='list-item'>
            <Button icon='format_list_bulleted' onClick={openPopupTaskRead}>Смотреть ТЗ</Button>
          </div>
          <div className='list-item'>
            <Button className={canMakeOffer ? '' : 'disabled'} icon='handshake' onClick={openPopupConfirmation}>{canMakeOffer ? 'Предложить бартер' : 'Уже сделали предложение'}</Button>
          </div>
        </div>
      </div>
      {!!product.barter?.task && <PopupTaskRead
          isOpen={isPopupTaskReadVisible}
          onClose={() => setIsPopupTaskReadVisible(false)}
          task={product.barter?.task}
        />}
      <PopupConfirmation
        id='popup-barter-offer'
        title='Предложить бартер?'
        text={(!!product.barter?.task ? 'Вы подтверждаете, что ознакомились с техническим заданием? ' : '') + 'Мы уведомим Селлера сразу после вашего предложения.'}
        isOpen={isPopupConfirmationBarterOfferVisible}
        onClose={() => setIsPopupConfirmationBarterOfferVisible(false)}
        onConfirmation={offerBarter}
      />
    </>
  );
};

export default ProductPageBloggerActions;