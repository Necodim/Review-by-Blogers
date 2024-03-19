import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import Link from '../Button/Link';

const Settings = (props) => {
    const navigate = useNavigate();
    const { tg, showBackButton, user } = useTelegram();

    useEffect(() => {
        if (tg) {
            showBackButton();
        }
    }, [tg, showBackButton]);

    if (window.Telegram.WebApp.SettingsButton) {
        tg.showAlert('window.Telegram.WebApp.SettingsButton')
        window.Telegram.WebApp.SettingsButton.onClick(() => {
            navigate('/settings');
        });
    } else {
        tg.showAlert('window.Telegram.WebApp.onEvent("settingsButtonClicked")')
        window.Telegram.WebApp.onEvent('settingsButtonClicked', () => {
            navigate('/settings');
        });
    }

    const goToStartScreen = () => {
        navigate('/');
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='settings' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>Настройки</h2>
                    </div>
                    <div className='list-item'>
                        <span className={'username'}>{user?.username}</span>
                    </div>
                    <div className='list-item'>
                        <Link onClick={goToStartScreen}>StartScreen</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings