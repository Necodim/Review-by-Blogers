import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';

const BarterStatusQueued = () => {
  const [text, setText] = useState(null);
  const { role } = useUserProfile();

  useEffect(() => {
    switch (role) {
      case 'blogger':
        setText('Селлер видит ваше предложение, но не может отправить средства на покупку товаров, т.к. вы достигли лимита активных бартеров. Завершите другие бартеры, чтобы продолжить работу по этому.');
        break;
      case 'seller':
        setText('Блогер отправил вам предложение о бартере, но достиг лимита активных бартеров. Вы не можете отправить средства на покупку товаров до тех пор, пока он не завершит по другим бартерам. Мы пришлём уведомление, когда вы сможете продолжить работу по бартеру.');
        break;
    }
  }, [role]);

  return (
    <div className='list'>
      <h2>Предложение в очереди</h2>
      <p>{text}</p>
    </div>
  );
}

export default BarterStatusQueued;