import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Heading1 from '../Barters/Heading/Heading1.jsx';
import Button from '../Button/Button.jsx';

const ProfileFooter = () => {
  const navigate = useNavigate();

  return (
    <div className='container' id='footer' >
      <Heading1 title='Другое' />
      <div className='list'>
        <Button className='list-item' icon='support_agent' onClick={() => { navigate('/info/support') }}>Поддержка</Button>
				<Button className='list-item' icon='article' onClick={() => { navigate('/info/user-agreement') }}>Пользовательское соглашение</Button>
      </div>
    </div>
  );
};

export default ProfileFooter;