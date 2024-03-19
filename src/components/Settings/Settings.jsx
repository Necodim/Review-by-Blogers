import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';

const Settings = (props) => {
    const navigate = useNavigate();
    const { tg, showBackButton, user } = useTelegram();

    useEffect(() => {
        if (tg) {
            showBackButton();
        }
    }, [tg, showBackButton]);

    if (window.Telegram.WebApp.SettingsButton) {
        window.Telegram.WebApp.SettingsButton.onClick(() => {
            navigate('/settings');
        });
    } else {
        window.Telegram.WebApp.onEvent('settingsButtonClicked', () => {
            navigate('/settings');
        });
    }

    return (
        <div className='settings'>
            <h2>Настройки</h2>
            <span className={'username'}>
                {user?.username}
            </span>
        </div>
    )
}

export default Settings