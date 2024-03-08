import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { useTelegram } from '../../hooks/useTelegram'
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Header from '../Header/Header';
import Form from '../Form/Form.jsx';
import Input from '../Form/Input.jsx';
import Link from '../Button/Link.jsx';

const ProfileBloger = () => {
    const { profile, updateProfile } = useUserProfile();
    const { isAvailable } = useTelegram();
    const { showToast, resetLoadingToast } = useToastManager();

    const [isEditing, setIsEditing] = useState(false);
    const [cardNumberValue, setCardNumberValue] = useState('');

    const navigate = useNavigate();

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const profileBlogerSave = async (e) => {
        // if (isAvailable()) {
            e.preventDefault();
            const onboarding = profile.onboarding;
            const formData = new FormData(e.target);
            let instagram = formData.get('instagram-username');
            if (instagram.includes('instagram.com/')) instagram = instagram.split('instagram.com/')[1].split('/')[0];
            if (instagram.includes('@')) instagram = instagram.split('@')[1];
            const data = {
                'card-number': parseInt(formData.get('card-number').replace(/\s/g, ''), 10),
                'instagram-username': instagram,
                'instagram-coverage': parseInt(formData.get('instagram-coverage'), 10),
                'onboarding': false,
            };
            await updateProfile(data);
            if (onboarding) {
                navigate('/blogger/store', { state: { showPopupAfterBlogerOnboarding: true } });
            } else {
                navigate('/blogger/store');
            }
        // } else {
        //     showToast('Редактирования профиля доступно только в Telegram', 'error');
        // }
    }

    const handleCardNumberChange = (event) => {
        let { value } = event.target;
        value = value.replace(/\s+/g, '');
        const newValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumberValue(newValue);
    }

    const profileBlogerForm = () => {
        return <Form onSubmit={profileBlogerSave} btntext='Сохранить' btnicon='save'>
            <Input
                id='card-number'
                name='card-number'
                title='Номер карты для переводов'
                placeholder={profile.card_number ? profile.card_number.replace(/(\d{4})(?=\d)/g, '$1 ') : '2202 2020 1234 5678'}
                required='required'
                value={cardNumberValue}
                onChange={handleCardNumberChange}
                maxLength='19'
            />
            <Input
                id='instagram'
                name='instagram-username'
                title='Ссылка на ваш Instagram'
                placeholder={profile.instagram.username ? 'https://www.instagram.com/' + profile.instagram.username : 'https://www.instagram.com/snezone'}
                required='required'
            />
            <Input
                id='coverage'
                type='number'
                min='1000'
                name='instagram-coverage'
                title='Средние охваты reels'
                placeholder={profile.instagram.coverage ? profile.instagram.coverage : 2000}
                required='required'
                onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/gi, '');
                }}
            />
        </Form>
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='profile'>
                <div className='list gap-l'>
                    <div className='list-item'>
                        <h2>{(profile.instagram.username && profile.instagram.coverage && profile.card_number) || !profile.onboarding ? 'Профиль' : 'Заполните профиль'}</h2>
                        {!profile.onboarding && <Link onClick={toggleEdit}>{isEditing ? 'Отменить' : 'Редактировать'}</Link>}
                    </div>
                    {isEditing && (
                        <div className='list-item'>
                            {profileBlogerForm()}
                        </div>
                    )}
                    {profile.onboarding &&
                        <div className='list-item'>
                            <span>После регистрации напишите в Instagram <a href='https://instagram.com/reviewbyblogers'>@reviewbyblogers</a> кодовое слово RB для подтверждения профиля</span>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default ProfileBloger;