import React from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import SubscribeHasSubscription from './SubscribeHasSubscription';
import SubscribeHasNoSubscription from './SubscribeHasNoSubscription';

const Subscribe = () => {
    const { profile } = useUserProfile();

    return profile.subscription?.active ? <SubscribeHasSubscription /> : <SubscribeHasNoSubscription />;
}

export default Subscribe;