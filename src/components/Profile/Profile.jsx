import React from 'react';
import './Profile.css';
import ProfileBlogger from './ProfileBlogger.jsx';
import ProfileSeller from './ProfileSeller.jsx';
import { useTelegram } from '../../hooks/useTelegram'
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Preloader from '../Preloader/Preloader';


const Profile = (props) => {
    const { showBackButton } = useTelegram();
    showBackButton();

    const { profile, loading } = useUserProfile();

    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    } else if (profile.role === 'seller') {
        return <ProfileSeller />
    } else if (profile.role === 'blogger') {
        return (<ProfileBlogger />)
    }
}

export default Profile