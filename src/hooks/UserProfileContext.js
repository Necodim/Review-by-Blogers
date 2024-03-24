import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { tg, user, isAvailable } = useTelegram();
    const { getUser, updateUser, generateAuthToken, addSellerSubscription, cancelSellerSubscription } = api;
    const { showToast } = useToastManager();

    // Для тестов
    const userId = user?.id;
    // const userId = 82431798;
    // const userId = 404;

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setTimeout(() => setErrorMessage(''), 500);
        }
    }, [errorMessage, showToast]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await generateAuthToken(userId);
                const userProfile = await getUser(userId);
                console.log(userProfile)
                setProfile(userProfile);
            } catch (error) {
                setErrorMessage('Ошибка при получении данных пользователя');
                if (isAvailable()) tg.showAlert('Ошибка при получении данных пользователя');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId, getUser, generateAuthToken]);

    const updateProfile = (updates) => {
        setProfile(currentProfile => ({ ...currentProfile, ...updates }));
    }

    const updateUserData = async (data) => {
        setLoading(true);
        try {
            const result = await updateUser(profile.id, data);
            if (result && result.success) {
                const updatedProfile = await getUser(profile.id);
                setProfile(updatedProfile);
                showToast(result.message || 'Данные успешно сохранены', 'success');
            } else {
                setErrorMessage(result.message || 'Произошла неизвестная ошибка');
            }
            return result;
        } catch (error) {
            setErrorMessage(error.message.toString());
        } finally {
            setLoading(false);
        }
    }

    const addSubscription = async (data) => {
        setLoading(true);
        try {
            const result = await addSellerSubscription(profile.id, data);
            showToast(`Вы подключили подписку. Сервис будет доступен до ${moment(result.subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
            return result;
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    }

    const cancelSubscription = async () => {
        setLoading(true);
        try {
            const result = await cancelSellerSubscription(profile.id);
            if (!!result && result.success && result.subscription) {
                console.log(result.subscription)
                showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
            } else if (!!result && !result.success && result.error) {
                setErrorMessage(result.message);
            } else {
                setErrorMessage('Произошла неизвестная ошибка');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <UserProfileContext.Provider value={{ profile, loading, updateProfile, updateUserData, addSubscription, cancelSubscription }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}