import React, { useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Link from '../Button/Link';

const Settings = (props) => {
    const navigate = useNavigate();
    const { profile } = useUserProfile();
    const { isAvailable, showBackButton, user } = useTelegram();

    useEffect(() => {
        if (isAvailable) {
            showBackButton();
        }
    }, [isAvailable, showBackButton]);

    const goToStartScreen = () => {
        navigate('/');
    }

    const addSubscription = async () => {
        if (user && user.id) {
            const data = {
                yookassa_id: '39afc4a2-6325-475b-9980-c4323ed72fa6',
                amount_value: 10000.00,
                amount_currency: 'RUB'
            }
            await api.addSellerSubscription(user.id, data);
            navigate('/');
        } else {
            alert('Пользователь не найден');
        }
    }

    const removeRole = async () => {
        if (user && user.id) {
            await api.updateUser(user.id, {role: ''});
            navigate('/');
        } else {
            alert('Пользователь не найден');
        }
    }

    return (
        <div className='content-wrapper'>
            <div className='container' id='settings' >
                <div className='list'>
                    <div className='list-item'>
                        <h2>Настройки</h2>
                    </div>
                    <div className='list-item'>
                        <span>{user?.username}</span>
                    </div>
                    {profile && profile.role === 'seller' && 
                    <div className='list-item'>
                        <Link onClick={addSubscription}>Включить тестовую подписку</Link>
                    </div>
                    }
                    <div className='list-item'>
                        <Link onClick={removeRole}>Сбросить роль пользователя</Link>
                    </div>
                    <div className='list-item'>
                        <Link onClick={goToStartScreen}>Начальный экран</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings