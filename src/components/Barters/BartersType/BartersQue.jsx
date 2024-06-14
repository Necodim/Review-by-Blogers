import React, { useEffect, useState } from 'react';
import BartersGrid from '../BartersGrid';
import { useUserProfile } from '../../../hooks/UserProfileContext';

const BartersQue = ({ offers }) => {
  const { role } = useUserProfile();

  const [ roleText, setRoleText ] = useState('Блогер должен');

  useEffect(() => {
    if (role === 'blogger') {
      setRoleText('Вы должны');
    } else if (role === 'seller') {
      setRoleText('Блогер должен');
    }
  }, [role])

  return (
    <div className='container' id='offers-que' >
      <div className='list'>
        <div className='list-item'>
          <h2>В ожидании</h2>
        </div>
        <div className='list-item'>
          <small>{roleText} завершить бартеры, которые находятся в работе, чтобы эти бартеры стали доступны.</small>
        </div>
      </div>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersQue;