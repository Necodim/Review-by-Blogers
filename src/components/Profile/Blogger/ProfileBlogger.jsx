import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext.js';
import Header from '../../Header/Header.jsx';
import ProfileFooter from '../ProfileFooter.jsx';
import ProfileBloggerForm from './ProfileBloggerForm.jsx';
import Button from '../../Button/Button.jsx';

const ProfileBlogger = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

	const goToNotificationsPage = () => {
		navigate('/profile/notifications');
	}

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='profile'>
        <div className='list gap-l'>
          <div className='list-item'>
            <h1>{(profile.instagram.username && profile.instagram.coverage && profile.card_number) || !profile.onboarding ? 'Профиль' : 'Заполните профиль'}</h1>
          </div>
          <ProfileBloggerForm />
        </div>
      </div>
      <div className='container' id='additional'>
        <div className='list'>
          <Button className='list-item' icon='notifications' onClick={goToNotificationsPage}>Уведомления</Button>
          <Button className='list-item' icon='handshake' onClick={() => { navigate('/profile/referral') } }>Партнёрская программа</Button>
          <Button className={'list-item' + (!profile.phone && ' success')} icon='verified_user' disabled={!!profile.phone} onClick={() => { navigate('/profile/verification') } }>Верификация</Button>
        </div>
      </div>
      <ProfileFooter />
    </div>
  );
};

export default ProfileBlogger;