import React from 'react'
import './StartScreen.css'
import { useTelegram } from '../../hooks/useTelegram'
import Button from '../../components/Button/Button'
import Icon from '../../components/Icon/Icon'
const StartScreen = (props) => {
    const {showBackButton} = useTelegram();
    
    showBackButton();

    const renderButtons = () => {
        return (
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
        );
    };

    const screen = (
        <div className='startscreen-wrapper'>
            <h1 className='h1'>
                Привет.<br />Выбери роль!
            </h1>
            {renderButtons()}
        </div>
    );
    
    return screen;
}


export default StartScreen