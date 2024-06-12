import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Button from '../Button/Button.jsx';
import Link from '../Button/Link.jsx';

const ProfileFooter = () => {
  const navigate = useNavigate();

  return (
    <div className='container' id='footer' >
      <div className='list'>
        <div className='list-item'>
          <h2>Другое</h2>
        </div>
      </div>
      <div className='list'>
        <Button className='list-item' icon='support_agent' onClick={() => { navigate('/info/support') }}>Поддержка</Button>
				<Button className='list-item' icon='article' onClick={() => { navigate('/info/user-agreement') }}>Пользовательское соглашение</Button>
      </div>
    </div>
  );
};

export default ProfileFooter;