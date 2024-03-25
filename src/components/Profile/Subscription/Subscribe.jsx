import React, { useEffect } from 'react';
import '../Profile.css';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useTelegram } from '../../../hooks/useTelegram';
import SubscribeHasSubscription from './SubscribeHasSubscription';
import SubscribeHasNoSubscription from './SubscribeHasNoSubscription';

const Subscribe = () => {
    const { profile } = useUserProfile();
    const { isAvailable, showBackButton } = useTelegram();
    
    useEffect(() => {
        if (isAvailable) showBackButton();
    }, [isAvailable, showBackButton]);

    return profile.subscription?.active ? <SubscribeHasSubscription /> : <SubscribeHasNoSubscription />;
}

export default Subscribe;