import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
	const { tg, user, isAvailable } = useTelegram();
	const { getUser, upsertUser, generateAuthToken } = api;
	const { showToast } = useToastManager();

	const [profile, setProfile] = useState(null);
	const [role, setRole] = useState(null);
	const [isActive, setIsActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	let userId = user?.id;
	// userId = 82431798;// Я
	// userId = 89141992;// Снежана
	// userId = 36058859;// Альберт

	useEffect(() => {
		if (!!profile) {
			profile.id = userId;
			console.log(profile);
		}
	}, [profile, userId])

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (userId) {
				try {
					const userData = JSON.parse(sessionStorage.getItem('userData'));
					const token = sessionStorage.getItem('accessToken');
					const expiredAt = parseInt(sessionStorage.getItem('accessTokenExpiredAt'), 10);

					if (!userData || !token || !expiredAt || moment(expiredAt).isBefore(moment())) {
						if (moment(expiredAt).isBefore(moment())) console.log('expired', moment(expiredAt).isBefore(moment()))
						await generateAndSetAuthToken();
					} else {
						setProfile(userData);
						setRole(userData.role);
						setIsActive(userData.subscription.active || userData.subscription.avaliable || userData.trial.active || userData.trial['barters-left'] > 0);
						setLoading(false);
					}
				} catch (error) {
					setErrorMessage('Ошибка при получении данных пользователя');
					if (isAvailable()) tg.showAlert('Ошибка при получении данных пользователя');
					setLoading(false);
				}
			} else {
				setErrorMessage('Воспользоваться приложением можно только в Telegram. Если приложение не запускается, напишите в бот @unpacksbot команду /help.');
				setLoading(false);
			}
		};

		const generateAndSetAuthToken = async () => {
			try {
				const tokenData = await generateAuthToken(userId);
				if (!!tokenData) {
					sessionStorage.setItem('accessToken', tokenData.data.accessToken);
					sessionStorage.setItem('accessTokenExpiredAt', tokenData.data.expiredAt);
					const user = await getUser();
					sessionStorage.setItem('userData', JSON.stringify(user));
					setProfile(user);
					setRole(user.role);
					setIsActive(user.subscription.active || user.subscription.avaliable || user.trial.active || user.trial['barters-left'] > 0);
				} else {
					throw new Error('Невозможно сгенерировать токен для пользователя');
				}
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

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	const updateProfile = (updates) => {
		setProfile(currentProfile => {
			const updatedProfile = { ...currentProfile, ...updates };
			console.log('Обновленный профиль:', updatedProfile);
			sessionStorage.setItem('userData', JSON.stringify(updatedProfile));
			return updatedProfile;
		});
	};

	const getUserData = async () => {
		try {
			const result = await getUser();
			if (!!result) {
				console.log('userData', result)
				setProfile(result);
				setRole(result.role);
				setIsActive(result.subscription.active || result.subscription.avaliable || result.trial.active || result.trial['barters-left'] > 0);
				sessionStorage.setItem('userData', JSON.stringify(result));
				return result;
			} else {
				console.error(result.message || 'Произошла неизвестная ошибка');
				return false;
			}
		} catch (error) {
			console.error(error.message.toString());
		}
	}

	const updateUserData = async (data) => {
		setLoading(true);
		try {
			const result = await upsertUser(data);
			if (!!result) {
				console.log('updateUserData', result)
				setProfile(result);
				setRole(result.role);
				setIsActive(result.subscription.active || result.subscription.avaliable || result.trial.active || result.trial['barters-left'] > 0);
				sessionStorage.setItem('userData', JSON.stringify(result));
				showToast(result.message || 'Данные успешно сохранены', 'success');
				return result;
			} else {
				setErrorMessage(result.message || 'Произошла неизвестная ошибка');
				return false;
			}
		} catch (error) {
			setErrorMessage(error.message.toString());
		} finally {
			setLoading(false);
		}
	}

	return (
		<UserProfileContext.Provider value={{ loading, profile, role, isActive, updateProfile, getUserData, updateUserData }}>
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