import React, { useEffect } from 'react'
import './Store.css'
import { useTelegram } from '../../hooks/useTelegram'
import { useUserProfile } from '../../hooks/UserProfileContext';
import StoreSeller from './Seller/StoreSeller.jsx';
import StoreBlogger from './Blogger/StoreBlogger.jsx';

const Store = (props) => {
    const { profile } = useUserProfile();

    const { isAvailable, hideBackButton } = useTelegram();
    
    useEffect(() => {
        if (isAvailable) hideBackButton();
    }, [isAvailable, hideBackButton]);

    if (profile.role === 'seller') {
        return (<StoreSeller />)
    } else if (profile.role === 'blogger') {
        return (<StoreBlogger />)
    }
}

export default Store;