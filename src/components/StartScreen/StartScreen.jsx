import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import { useTelegram } from "../../hooks/useTelegram";
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const StartScreen = () => {
    const navigate = useNavigate();
    const { profile, updateProfile } = useUserProfile();
    const { tg, isAvailable } = useTelegram();
    const { showToast, resetLoadingToast } = useToastManager();

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (errorMessage) {
            resetLoadingToast();
            showToast(errorMessage, 'error');
        }
    }, [errorMessage, showToast]);

    const handleRoleSelect = async (role) => {
        try {
            const result = await updateProfile({ role: role });
            console.log(result)
        } catch (error) {
            const errorText = 'Произошла ошибка при выборе роли пользователя';
            setErrorMessage(errorText);
            console.error(`${errorText}:`, error);
            isAvailable() ? tg.showAlert(errorText + '. Попробуйте ещё раз.') : alert(errorText);
        } finally {
            navigate('/profile');
        }
    }

    const showProfile = () => {
        alert(JSON.stringify(profile));
    }

    const showSettings = () => {
        navigate('/settings');
    }

    return (
        <div className='content-wrapper startscreen w-auto'>
            <h1 className='h1'>
                Привет.<br />Выбери роль!
            </h1>
            <div className='buttons-wrapper'>
                <Button className='light size-xl' onClick={() => handleRoleSelect('blogger')}>
                    <Icon icon={'face_retouching_natural'} />
                    Блогер
                </Button>
                <Button className='light size-xl' onClick={() => handleRoleSelect('seller')}>
                    <Icon icon='store' />
                    Селлер
                </Button>
            </div>
            <div className='buttons-wrapper'>
                <Button className='light size-xl' onClick={() => showProfile()}>
                    <Icon icon='assignment_ind' />
                    Profile
                </Button>
                <Button className='light size-xl' onClick={() => showSettings()}>
                    <Icon icon='settings' />
                    Настройки
                </Button>
            </div>
        </div>
    );
};

export default StartScreen;