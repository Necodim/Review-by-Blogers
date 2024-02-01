import React from 'react'

const Settings = (props) => {
    const { user } = useTelegram();
    
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