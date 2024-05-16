import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Textarea from '../../Form/Textarea';

const BarterStatusRefused = ({ reason }) => {
  const { role } = useUserProfile();
  const [text, setText] = useState(null);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText(`Селлер отклонил ваше предложение${!reason ? ' без объяснения причины.' : ' по следующей причине:'}`);
        break;
      case 'seller':
        setText(`Вы отклонили предложение${!reason ? ' без объяснения причины.' : ' по следующей причине:'}`);
        break;
    }
  }, [role]);

  return (
    <div className='list'>
      <h2>Предложение отклонено</h2>
      <p>{text}</p>
      {reason && <Textarea id='reason' name='reason' value={reason} readOnly={true} />}
    </div>
  );
}

export default BarterStatusRefused;