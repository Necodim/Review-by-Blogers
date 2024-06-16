import React from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext.js';
import Header from '../../Header/Header.jsx';
import ProfileFooter from '../ProfileFooter.jsx';
import ProfileBloggerForm from './ProfileBloggerForm.jsx';

const ProfileBlogger = () => {
  const { profile } = useUserProfile();

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
      <ProfileFooter />
    </div>
  );
};

export default ProfileBlogger;