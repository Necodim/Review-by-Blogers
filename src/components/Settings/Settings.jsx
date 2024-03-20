import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import Link from '../Button/Link';

const Settings = (props) => {
    const navigate = useNavigate();
    const { isAvailable, showBackButton, user } = useTelegram();

    useEffect(() => {
        if (isAvailable) {
            showBackButton();
        }
    }, [isAvailable, showBackButton]);

    const goToStartScreen = () => {
        navigate('/');
    }

    return (
        <div className='content-wrapper'>
            <div className='container' id='settings' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>Настройки</h2>
                    </div>
                    <div className='list-item'>
                        <span className={'username'}>{user?.username}</span>
                    </div>
                    <div className='list-item'>
                        <Link onClick={goToStartScreen}>StartScreen</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings