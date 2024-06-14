import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const StartScreen = () => {
	const navigate = useNavigate();
	const { profile, role, updateUserData } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	useEffect(() => {
		if (role && isUpdated) {
			navigate('/profile');
		}
	}, [role, isUpdated, navigate]);

	useEffect(() => {
		if (role) {
			navigate('/profile');
		}
	}, [role, navigate]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await updateUserData(profile);
			} catch (error) {
				const errorText = 'Произошла ошибка при обновлении данных пользователя';
				setErrorMessage(errorText);
				console.error(`${errorText}:`, error);
			}
		};

		fetchData();
	}, [profile, updateUserData]);

	const handleRoleSelect = async (role) => {
		try {
			await updateUserData({ role: role });
			setIsUpdated(true);
		} catch (error) {
			const errorText = 'Произошла ошибка при выборе роли пользователя';
			setErrorMessage(errorText);
			console.error(`${errorText}:`, error);
		}
	}

	return (
		<div className='content-wrapper startscreen'>
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
		</div>
	);
};

export default StartScreen;