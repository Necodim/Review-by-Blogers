import React from 'react'
import { useTelegram } from '../../hooks/useTelegram';


const Settings = (props) => {
    const { showBackButton, user } = useTelegram();
    showBackButton();

    window.Telegram.WebApp.SettingsButton.onClick(() => {
        let navigate = useNavigate();
        navigate('settings');
    });
    window.Telegram.WebApp.onEvent('settingsButtonClicked', () => {
        let navigate = useNavigate();
        navigate('settings');
    });

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