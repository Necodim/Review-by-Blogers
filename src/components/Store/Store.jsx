import React from 'react'
import './Store.css'
import { useTelegram } from '../../hooks/useTelegram'

const Store = (props) => {
    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div>
            <span>
                Товары
            </span>
        </div>
    )
}

export default Store