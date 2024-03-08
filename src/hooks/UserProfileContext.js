import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getUser, generateAuthToken } = api;
    const { user } = useTelegram();
    const { showToast, resetLoadingToast } = useToastManager();

    // Для тестов
    const userId = user?.id || 82431798;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await generateAuthToken(userId);
                const userProfile = await getUser(userId);
                console.log(userProfile)
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
            const result = await api.updateUser(profile.id, data);
            if (result && result.success) {
                // После успешного обновления, перезагрузите данные профиля
                const updatedProfile = await getUser(profile.id);
                setProfile(updatedProfile);
                showToast(result.message || 'Данные успешно сохранены', 'success');
            } else {
                showToast(result.error || 'Произошла неизвестная ошибка', 'error');
            }
        } catch (error) {
            showToast(error.toString(), 'error');
        } finally {
            setLoading(false);
        }
    }

    const cancelSubscription = async () => {
        setLoading(true);
        try {
            const result = await api.cancelSellerSubscription(profile.id);
            if (!!result && result.success && result.subscription) {
                showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.subscription.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
            } else if (!!result && !result.success && result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Произошла неизвестная ошибка', 'error');
            }
        } catch (error) {
            showToast(error, 'error');
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