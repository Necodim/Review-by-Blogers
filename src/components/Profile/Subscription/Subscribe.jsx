import React from 'react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import SubscribeHasSubscription from './SubscribeHasSubscription';
import SubscribeHasNoSubscription from './SubscribeHasNoSubscription';

const Subscribe = () => {
    const { period } = location.state || 'month';
    const { profile } = useUserProfile();

    return profile.subscription?.active ? <SubscribeHasSubscription /> : <SubscribeHasNoSubscription period={period} />;
}

export default Subscribe;