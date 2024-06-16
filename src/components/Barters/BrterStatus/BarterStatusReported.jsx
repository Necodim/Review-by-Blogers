import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import api from '../../../api/api';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import Textarea from '../../Form/Textarea';
import Button from '../../Button/Button';

const BarterStatusReported = ({ offer, updateOffer }) => {
  const { role } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('Отчёты отправлены')
  const [text, setText] = useState(null);
  const [formSending, setFormSending] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setTitle('Отчёты отправлены');
        setText('Работа сделана. Дождитесь подтверждения со стороны селлера, тогда бартер перейдёт в статус «Завершен» и переместится в соответствующий раздел.');
        break;
      case 'seller':
        setTitle('Готов отчёт №2');
        setText(`Блогер выложил ролик${offer.feedback_blogger ? ' и оставил отзыв на товар' : ''}. Посмотрите ролик и закройте текущий бартер. Если вам понравилась работа с этим блогером или его ролик, напишите, пожалуйста, отзыв.`);
        break;
    }
  }, [role, offer]);

  const goToInstagram = () => {
    window.open(offer.reels, '_blank', 'noopener,noreferrer');
  }

  const handleChangeFeedback = (e) => {
    setFormFeedback(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSending(true);

    try {
      const data = {
        offerId: offer.id,
        status: offer.status,
        feedback: formFeedback,
      }

      const updatedOffer = await api.updateBarterOffer(data);
      updateOffer(updatedOffer);
      showToast('Вы завершили текущий бартер', 'success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setFormSending(false);
    }
  };

  const sellerReported = () => {
    return (
      <div className='list gap-xl w-100'>
        <Button className={'w-100' + (!offer.reels && ' disabled')} target='_blank' icon='center_focus_strong' onClick={goToInstagram}>Смотреть Reels</Button>
        <Form
          onSubmit={handleSubmit}
          isDisabled={formSending}
          btntext='Закрыть бартер'
        >
          <Textarea
            id='feedback'
            name='feedback'
            title='Отзыв'
            placeholder='Мне понравился блогер / ролик, потому что...'
            value={formFeedback}
            onChange={handleChangeFeedback}
          />
        </Form>
      </div>
    )
  }

  return (
    <div className='list'>
      <h1>{title}</h1>
      <p>{text}</p>
      {role === 'seller' && sellerReported()}
    </div>
  );
}

export default BarterStatusReported;