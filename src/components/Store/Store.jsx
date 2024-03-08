import React from 'react'
import './Store.css'
import StoreSeller from './StoreSeller.jsx';
import StoreBloger from './StoreBloger.jsx';
import { useTelegram } from '../../hooks/useTelegram.js'
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Preloader from '../Preloader/Preloader.jsx';

const Store = (props) => {
    const { showBackButton } = useTelegram();
    showBackButton();

    const { profile, loading } = useUserProfile();

    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    } else if (profile.role === 'seller') {
        return (<StoreSeller />)
    } else if (profile.role === 'bloger') {
        return (<StoreBloger />)
    }
}

export default Store;