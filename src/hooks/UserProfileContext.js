import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useTelegram } from './useTelegram';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useTelegram();
    const { getUser } = api;

    // Для тестов
    const userId = user?.id || 82431798;

    useEffect(() => {
        setProfile({id: user?.id, role: 'seller'})
        setLoading(false);
        // getUser(userId).then(data => {
        //     setProfile(data);
        //     setLoading(false);
        // });
    }, [userId]);

    return (
        <UserProfileContext.Provider value={{ profile, loading }}>
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