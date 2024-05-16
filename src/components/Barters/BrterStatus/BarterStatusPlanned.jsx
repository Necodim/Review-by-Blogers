import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Popup from '../../Popup/Popup';

const BarterStatusPlanned = ({ barter, updateBarter }) => {
  const { role } = useUserProfile();

  const [title, setTitle] = useState('Работа по бартеру началась')
  const [text, setText] = useState(null);
  const [formSending, setFormSending] = useState(false);
  const [formReels, setFormReels] = useState(null);
  const [formFeedback, setFormFeedback] = useState(false);
  const [reelsError, setReelsError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setTitle('Отчёт по бартеру №2');
        setText('Отправьте ссылку на выложенный reels и укажите, оставили ли вы отзыв на купленный товар в магазине селлера на маркетплейсе.');
        break;
      case 'seller':
        setTitle('Готов отчёт №1');
        setText(`Блогер подтвердил факт заказа товара и запланировал дату рекламной кампании${barter?.offer?.date ? `на ${barter.offer.date}` : ''}.`);
        break;
    }
  }, [role, barter]);

  const handleChangeReels = (e) => {
    setFormReels(e.target.value);
    setReelsError(null);
  }

  const handleChangeFeedback = (e) => {
    setFormFeedback(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formReels) {
      setReelsError('Вставьте ссылку на reels');
      return
    }
    setFormSending(true);

    try {
      const data = {
        barterId: barter.id,
        offerId: barter.offer.id,
        status: barter.offer.status,
        reels: formReels,
        feedback: formFeedback,
      }

      const updatedOffer = await api.updateBarterOffer(data);
      updateBarter(prevBarter => ({
        ...prevBarter,
        offer: {
          ...prevBarter.offer,
          status: updatedOffer.status,
          reels: updatedOffer.reels,
          feedback_blogger: updatedOffer.feedback
        }
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
        <Popup isOpen={isPopupOpen} onClose={closePopupScreenshot}>
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
          onChange={handleChangeReels}
          error={reelsError}
        />
        <Input
          type='checkbox'
          id='feedback'
          name='feedback'
          title='Сбор отзывов'
          label='Отзыв о товаре оставлен'
          checked={formFeedback}
          onChange={handleChangeFeedback}
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