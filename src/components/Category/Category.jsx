import React from 'react'
import './Category.css'
import { useTelegram } from '../../hooks/useTelegram'

const Category = (props) => {
    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div>
            <span>
                Категории
            </span>
        </div>
    )
}

export default Category