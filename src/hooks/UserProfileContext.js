import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
	const [profile, setProfile] = useState(null);
	const [role, setRole] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const { tg, user, isAvailable } = useTelegram();
	const { getUser, createUser, upsertUser, generateAuthToken, verifyAuthToken, addSellerSubscription, cancelSellerSubscription } = api;
	const { showToast } = useToastManager();

	// Для тестов
	// const userId = user?.id;
	const userId = 82431798;
	// const userId = 404;

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (userId) {
				try {
					const userData = JSON.parse(sessionStorage.getItem('userData'));
					const token = sessionStorage.getItem('accessToken');
					const expiredAt = sessionStorage.getItem('accessTokenExpiredAt');

					if (!userData || !token || !expiredAt || moment(expiredAt).isBefore(moment())) {
						if (!userData) console.log('!userData', !userData)
						if (!token) console.log('!token', !token)
						if (!expiredAt) console.log('!expiredAt', !expiredAt)
						if (moment(expiredAt).isBefore(moment())) console.log('expired', moment(expiredAt).isBefore(moment()))
						await generateAndSetAuthToken();
					} else {
						setProfile(userData);
						setRole(userData.role);
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

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setLoading(true);
	// 		if (userId) {
	// 			try {
	// 				await generateAuthToken(userId);
	// 				const existingUser = await getUser(userId);
	// 				if (!existingUser) {
	// 					const data = {
	// 						username: user?.username,
	// 						firstname: user?.first_name,
	// 						lastname: user?.last_name
	// 					}
	// 					const newUser = await createUser(userId, data);
	// 					console.log(newUser);
	// 					setProfile(newUser);
	// 					setRole(newUser.role)
	// 				} else {
	// 					console.log(existingUser);
	// 					setProfile(existingUser);
	// 					setRole(existingUser.role)
	// 				}
	// 				// setProfile({id:82431798, trial:{active:false}, role:'seller'})
	// 			} catch (error) {
	// 				setErrorMessage('Ошибка при получении данных пользователя');
	// 				if (isAvailable()) tg.showAlert('Ошибка при получении данных пользователя');
	// 			} finally {
	// 				setLoading(false);
	// 			}
	// 		} else {
	// 			setErrorMessage('Воспользоваться приложением можно только в Telegram. Если приложение не запускается, напишите в бот @unpacksbot команду /help.')
	// 		}
	// 	};

	// 	if (userId) {
	// 		fetchData();
	// 	}
	// }, [userId, getUser, generateAuthToken]);

	const updateProfile = (updates) => {
		setProfile(currentProfile => ({ ...currentProfile, ...updates }));
	}

	const updateUserData = async (data) => {
		setLoading(true);
		try {
			const result = await upsertUser(data);
			if (!!result) {
				setProfile(result);
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
		<UserProfileContext.Provider value={{ loading, profile, role, updateProfile, updateUserData, addSubscription, cancelSubscription }}>
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