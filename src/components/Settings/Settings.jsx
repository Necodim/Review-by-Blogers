import React from 'react'
import { useTelegram } from '../../hooks/useTelegram'

const Settings = (props) => {
    const { user, showBackButton } = useTelegram();
    showBackButton();
    
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