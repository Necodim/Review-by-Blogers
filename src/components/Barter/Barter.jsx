import React from 'react'
import './Barter.css'
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useTelegram } from '../../hooks/useTelegram'
import Header from '../Header/Header';
import Preloader from '../Preloader/Preloader';

const Barter = (props) => {
    const { profile, loading } = useUserProfile();
    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    }

    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div>
            <Header />
            <span>
                Бартеры
            </span>
        </div>
    )
}

export default Barter