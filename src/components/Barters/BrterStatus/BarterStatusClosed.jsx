import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Button from '../../Button/Button';
import Textarea from '../../Form/Textarea';

const BarterStatusClosed = ({ barter }) => {
  const { role } = useUserProfile();
  const [text, setText] = useState(null);
  const [feedback, setFeedback] = useState(barter.offer?.feedback_seller);

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
    setFeedback(barter.offer?.feedback_seller);
  }, [barter]);

  const goToInstagram = () => {
    window.open(barter.offer.reels, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className='list'>
      <div className='list-item'>
        <h2>Бартер окончен</h2>
      </div>
      <div className='list-item'>
        <p>{barter?.offer?.date ? `Дата публикации: ${moment(barter.offer.date).format('DD.MM.YYYY')}` : ''}</p>
      </div>
      {barter.offer.reels &&
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