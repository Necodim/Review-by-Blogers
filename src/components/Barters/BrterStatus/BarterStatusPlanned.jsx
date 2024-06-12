import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Popup from '../../Popup/Popup';
import Button from '../../Button/Button';

const BarterStatusPlanned = ({ barter, updateBarter }) => {
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
        setText(`Опубликуйте reels${barter?.offer?.date ? ` ${moment(barter.offer.date).format('DD.MM.YYYY')}` : ''}, отправьте ссылку на него и укажите, оставили ли вы отзыв на купленный товар в магазине селлера на маркетплейсе.`);
        break;
      case 'seller':
        setTitle('Выбрана дата рекламы');
        setText(`Блогер подтвердил факт заказа товара и запланировал дату рекламной кампании${barter?.offer?.date ? ` на ${moment(barter.offer.date).format('DD.MM.YYYY')}` : ''}.`);
        break;
    }
  }, [role, barter]);

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
    if (!formReels || (!formFeedback && barter.need_feedback)) {
      if (!formReels) setReelsError('Вставьте ссылку на reels');
      if (!formFeedback && barter.need_feedback) setFeedbackError('Необходимо оставить отзыв о товаре на маркетплейсе');
      return
    }
    setFormSending(true);

    try {
      const data = {
        offerId: barter.offer.id,
        status: barter.offer.status,
        reels: formReels,
        feedback: formFeedback,
      }

      const updatedOffer = await api.updateBarterOffer(data);
      updateBarter(prevBarter => ({
        ...prevBarter,
        offer: updatedOffer
      }));
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
          <img src={barter?.offer?.screenshot} className='w-100' />
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
          title={`Сбор отзывов${barter.need_feedback && ' *'}`}
          label='Отзыв о товаре оставлен'
          checked={formFeedback}
          // required={barter.need_feedback}
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