import React from 'react'
import './Store.css'
import StoreSeller from './StoreSeller.jsx';
import StoreBloger from './StoreBloger.jsx';
import { useTelegram } from '../../hooks/useTelegram'
import { useUserProfile } from '../../hooks/UserProfileContext';

const Store = (props) => {
    const { profile } = useUserProfile();

    const { showBackButton } = useTelegram();
    showBackButton();

    if (profile.role === 'seller') {
        return (<StoreSeller />)
    } else if (profile.role === 'bloger') {
        return (<StoreBloger />)
    }
}

export default Store;