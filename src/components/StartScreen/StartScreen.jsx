import React, { useEffect } from 'react'
import './StartScreen.css'
import { useUserProfile } from '../../hooks/UserProfileContext';
import { callback } from '../../hooks/callback'
import Preloader from '../Preloader/Preloader';
import Button from '../Button/Button'
import Icon from '../Icon/Icon'

const StartScreen = (props) => {
    const { profile, loading } = useUserProfile();

    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    }

    const { roleCallback } = callback();

    const renderButtons = () => {
        return (
            <div className='buttons-wrapper'>
                <Button className='light size-xl' onClick={roleCallback} data-role='bloger'>
                    <Icon icon={'face_retouching_natural'} />
                    Блогер
                </Button>
                <Button className='light size-xl' onClick={roleCallback} data-role='seller'>
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