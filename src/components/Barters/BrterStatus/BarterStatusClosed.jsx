import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
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

  return (
    <div className='list'>
      <h2>Бартер окончен</h2>
      <p>{text}</p>
      {feedback && <Textarea id='feedback' name='feedback' value={feedback} readOnly={true} />}
    </div>
  );
}

export default BarterStatusClosed;