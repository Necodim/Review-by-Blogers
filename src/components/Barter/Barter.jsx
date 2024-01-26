import React from 'react'
import './Barter.css'
import { useTelegram } from '../../hooks/useTelegram'

const Barter = (props) => {
    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div>
            <span>
                Бартеры
            </span>
        </div>
    )
}

export default Barter