import React from 'react'
import './StartScreen.css'
import { useTelegram } from '../../hooks/useTelegram'
import Button from '../Button/Button'
import Icon from '../Icon/Icon'

const StartScreen = (props) => {
    const {showBackButton, user} = useTelegram();
    showBackButton();

    return (
        <div className='content-wrapper'>
            <h1 className='h1'>
                Привет. Выбери роль!
            </h1>
            <div className='buttons-wrapper'>
                <Button className='light size-xl'>
                    <Icon icon={'face_retouching_natural'} />
                    Блогер
                </Button>
                <Button className='light size-xl'>
                    <Icon icon='store' />
                    Селлер
                </Button>
            </div>
        </div>
    )
}

export default StartScreen