import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import api from '../api/api';
import { useTelegram } from './useTelegram';
import { useToastManager } from './useToast';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
	const { tg, user, isAvailable } = useTelegram();
	const { getUser, createUser, upsertUser, generateAuthToken, verifyAuthToken, addSellerSubscription, cancelSellerSubscription } = api;
	const { showToast } = useToastManager();

	const [profile, setProfile] = useState(null);
	const [role, setRole] = useState(null);
	const [isActive, setIsActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	// const userId = user?.id;
	// Для тестов
	// const userId = 82431798; // Я
	const userId = 89141992; // Снежана
	// const userId = 976651721;

	useEffect(() => {
		if (!!profile) console.log(profile)
	}, [profile])

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
		setProfile(currentProfile => {
			const updatedProfile = { ...currentProfile, ...updates };
			console.log('Обновленный профиль:', updatedProfile);
			sessionStorage.setItem('userData', JSON.stringify(updatedProfile));
			return updatedProfile;
		});
	};

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

	const addSubscription = async (data) => {
		setLoading(true);
		try {
			const result = await addSellerSubscription(data);
			setProfile(currentProfile => {
				const updatedProfile = { ...currentProfile, subscription: result };
				sessionStorage.setItem('userData', JSON.stringify(updatedProfile));
				return updatedProfile;
			});
			showToast(`Вы подключили подписку. Сервис будет доступен до ${moment(result.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
			return result;
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	const cancelSubscription = async () => {
		setLoading(true);
		try {
			const result = await cancelSellerSubscription();
			setProfile(currentProfile => {
				const updatedProfile = { ...currentProfile, subscription: result };
				sessionStorage.setItem('userData', JSON.stringify(updatedProfile));
				return updatedProfile;
			});
			showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.expired_at).format('DD.MM.YYYY, HH:mm')}.`, 'success');
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<UserProfileContext.Provider value={{ loading, profile, role, isActive, updateProfile, updateUserData, addSubscription, cancelSubscription }}>
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