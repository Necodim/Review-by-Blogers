import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import SubscribeHasSubscription from './SubscribeHasSubscription';
import SubscribeHasNoSubscription from './SubscribeHasNoSubscription';

const Subscribe = () => {
    const location = useLocation();
    const { period } = location.state || { period: 'month' };
    const { profile } = useUserProfile();

    return profile.subscription?.active ? <SubscribeHasSubscription /> : <SubscribeHasNoSubscription period={period} />;
}

export default Subscribe;