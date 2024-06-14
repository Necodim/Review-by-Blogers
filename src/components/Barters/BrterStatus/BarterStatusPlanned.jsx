import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Popup from '../../Popup/Popup';
import Button from '../../Button/Button';

const BarterStatusPlanned = ({ offer, updateOffer }) => {
  const { role } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('Работа по бартеру началась')
  const [text, setText] = useState(null);
  const [formSending, setFormSending] = useState(false);
  const [formReels, setFormReels] = useState('');
  const [formFeedback, setFormFeedback] = useState(false);
  const [reelsError, setReelsError] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setTitle('Отчёт №2 по бартеру');
        setText(`Опубликуйте reels${offer?.date ? ` ${moment(offer.date).format('DD.MM.YYYY')}` : ''}, отправьте ссылку на него и укажите, оставили ли вы отзыв на купленный товар в магазине селлера на маркетплейсе.`);
        break;
      case 'seller':
        setTitle('Выбрана дата рекламы');
        setText(`Блогер подтвердил факт заказа товара и запланировал дату рекламной кампании${offer?.date ? ` на ${moment(offer.date).format('DD.MM.YYYY')}` : ''}.`);
        break;
    }
  }, [role, offer]);

  const handleChangeReels = (e) => {
    setFormReels(e.target.value);
    setReelsError(null);
    setFeedbackError(null);
  }

  const handleChangeFeedback = (e) => {
    setFormFeedback(e.target.checked);
    setReelsError(null);
    setFeedbackError(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formReels || (!formFeedback && offer.barter.need_feedback)) {
      if (!formReels) setReelsError('Вставьте ссылку на reels');
      if (!formFeedback && offer.barter.need_feedback) setFeedbackError('Необходимо оставить отзыв о товаре на маркетплейсе');
      return
    }
    setFormSending(true);

    try {
      const data = {
        offerId: offer.id,
        status: offer.status,
        reels: formReels,
        feedback: formFeedback,
      }

      const updatedOffer = await api.updateBarterOffer(data);
      updateOffer(updatedOffer);
      showToast('Второй отчёт по бартеру отправлен', 'success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setFormSending(false);
    }
  };

  const openPopupScreenshot = () => {
    setIsPopupOpen(true);
  }

  const closePopupScreenshot = () => {
    setIsPopupOpen(false);
  }

  const sellerPlanned = () => {
    return (
      <>
        <Button className='w-100' icon='screenshot' onClick={openPopupScreenshot}>Посмотреть скриншот заказа</Button>
        <Popup id='popup-order-screenshot' isOpen={isPopupOpen} onClose={closePopupScreenshot}>
          <img src={offer?.screenshot} className='w-100' />
        </Popup>
      </>
    )
  }

  const bloggerPlanned = () => {
    return (
      <Form
        onSubmit={handleSubmit}
        isDisabled={formSending}
      >
        <Input
          type='url'
          id='reels'
          name='reels'
          title='Ссылка на reels *'
          placeholder='https://www.instagram.com/reel/A1bcdefG2Hi'
          value={formReels}
          fade={true}
          // required={true}
          onChange={handleChangeReels}
          error={reelsError}
        />
        <Input
          type='checkbox'
          id='feedback'
          name='feedback'
          title={`Сбор отзывов${offer.barter.need_feedback && ' *'}`}
          label='Отзыв о товаре оставлен'
          checked={formFeedback}
          // required={offer.barter.need_feedback}
          onChange={handleChangeFeedback}
          error={feedbackError}
        />
      </Form>
    )
  }

  const contentToShow = () => {
    return role === 'seller' ? sellerPlanned() : bloggerPlanned();
  }

  return (
    <div className='list'>
      <h2>{title}</h2>
      <p>{text}</p>
      {contentToShow()}
    </div>
  );
}

export default BarterStatusPlanned;