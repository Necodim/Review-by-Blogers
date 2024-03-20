import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { user } = useTelegram();
    const { getUser, updateUser, generateAuthToken, cancelSellerSubscription } = api;
    const { showToast, resetLoadingToast } = useToastManager();

    // Для тестов
    const userId = user?.id;
    // const userId = 82431798;
    // const userId = 404;

    useEffect(() => {
        if (errorMessage) {
            resetLoadingToast();
            showToast(errorMessage, 'error');
        }
    }, [errorMessage, showToast]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await generateAuthToken(userId);
                const userProfile = await getUser(userId);
                tg.showAlert(JSON.stringify(userProfile))
                setProfile(userProfile);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                // Обработка ошибок, например, установка состояния ошибки
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId, getUser, generateAuthToken]);

    const updateProfile = async (data) => {
        setLoading(true);
        try {
            const result = await updateUser(profile.id, data);
            if (result && result.success) {
                const updatedProfile = await getUser(profile.id);
                setProfile(updatedProfile);
                showToast(result.message || 'Данные успешно сохранены', 'success');
            } else {
                setErrorMessage(result.error || 'Произошла неизвестная ошибка');
            }
            return result;
        } catch (error) {
            setErrorMessage(error.toString());
        } finally {
            setLoading(false);
        }
    }

    const cancelSubscription = async () => {
        setLoading(true);
        try {
            const result = await cancelSellerSubscription(profile.id);
            if (!!result && result.success && result.subscription) {
                showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
            } else if (!!result && !result.success && result.error) {
                setErrorMessage(result.error);
            } else {
                setErrorMessage('Произошла неизвестная ошибка');
            }
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <UserProfileContext.Provider value={{ profile, loading, updateProfile, cancelSubscription }}>
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
};


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../api/api';
// import { useTelegram } from './useTelegram';

// const UserProfileContext = createContext();

// export const UserProfileProvider = ({ children }) => {
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const { user } = useTelegram();
//     const { getUser, generateAuthToken } = api;

//     // Для тестов
//     const userId = user?.id || 82431798;

//     useEffect(() => {
//         // setProfile({id: userId, role: 'seller'})
//         // setLoading(false);
//         generateAuthToken(userId);
//         getUser(userId).then(data => {
//             console.log(data)
//             setProfile(data);
//             setLoading(false);
//         });
//     }, [userId]);

//     return (
//         <UserProfileContext.Provider value={{ profile, loading }}>
//             {children}
//         </UserProfileContext.Provider>
//     );
// };

// export const useUserProfile = () => {
//     const context = useContext(UserProfileContext);
//     if (context === undefined) {
//         throw new Error('useUserProfile must be used within a UserProfileProvider');
//     }
//     return context;
// };