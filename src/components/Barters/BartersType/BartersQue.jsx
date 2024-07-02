import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Heading1 from '../Heading/Heading1';
import BartersGrid from '../BartersGrid';

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
      <Heading1 title='В ожидании'>
        <div className='list-item'><small>{roleText} завершить бартеры, которые находятся в работе, чтобы эти бартеры стали доступны.</small></div>
      </Heading1>
      <BartersGrid offers={offers} />
    </div>
  );
}

export default BartersQue;