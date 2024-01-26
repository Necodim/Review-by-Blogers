import React from 'react'
import 'Header.css'
import { useTelegram } from '../../hooks/useTelegram'

const Header = (props) => {
    const {onClose, user} = useTelegram();

    return (
        <div className={'header'}>
            <Button onClick={onClose}>Закрыть</Button>
            <span className={'username'}>
                {user?.username}
            </span>
        </div>
    )
}

export default Header