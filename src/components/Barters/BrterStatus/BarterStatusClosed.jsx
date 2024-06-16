import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Button from '../../Button/Button';
import Textarea from '../../Form/Textarea';

const BarterStatusClosed = ({ offer }) => {
  const { role } = useUserProfile();
  const [text, setText] = useState(null);
  const [feedback, setFeedback] = useState(offer?.feedback_seller);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText(`Все стороны выполнили свои обязательства.${feedback ? ' Селлер оставил отзыв:' : ''}`);
        break;
      case 'seller':
        setText(`Все стороны выполнили свои обязательства.${feedback ? ' Вы оставили отзыв:' : ''}`);
        break;
    }
  }, [role]);

  useEffect(() => {
    setFeedback(offer?.feedback_seller);
  }, [offer]);

  const goToInstagram = () => {
    window.open(offer.reels, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className='list'>
      <div className='list-item'>
        <h1>Бартер окончен</h1>
      </div>
      <div className='list-item'>
        <p>{offer?.date ? `Дата публикации: ${moment(offer.date).format('DD.MM.YYYY')}` : ''}</p>
      </div>
      {offer.reels &&
        <div className='list-item'>
          <Button className='w-100' target='_blank' icon='center_focus_strong' onClick={goToInstagram}>Смотреть Reels</Button>
        </div>
      }
      <div className='list-item'>{text}</div>
      {feedback && 
        <div className='list-item'>
          <Textarea id='feedback' name='feedback' value={feedback} readOnly={true} />
        </div>
      }
    </div>
  );
}

export default BarterStatusClosed;