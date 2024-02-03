import React from 'react'
import './Store.css'
import { useUserProfile } from '../../UserProfileContext';
import { useTelegram } from '../../hooks/useTelegram'
import Header from '../Header/Header';
import Preloader from '../Preloader/Preloader';

const Store = (props) => {
    const { profile, loading } = useUserProfile();
    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    }

    const { showBackButton } = useTelegram();
    showBackButton();

    return (
        <div>
            <Header />
            <span>
                Товары
            </span>
        </div>
    )
}

export default Store