import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';

const BarterStatusClosed = () => {
  const { role } = useUserProfile();
  const [text, setText] = useState(null);

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText(`Все стороны выполнили свои обязательства.`);
        break;
      case 'seller':
        setText(`Все стороны выполнили свои обязательства.`);
        break;
    }
  }, [role]);

  return (
    <div className='list'>
      <h2>Бартер окончен</h2>
      <p>{text}</p>
    </div>
  );
}

export default BarterStatusClosed;