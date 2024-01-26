import React from 'react'
import './Profile.css'
import { useTelegram } from '../../hooks/useTelegram'

const Profile = (props) => {
    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div>
            <span>
                {user?.username}
            </span>
            <span>
                {JSON.parse(user)}
            </span>
        </div>
    )
}

export default Profile