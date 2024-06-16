import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import Button from '../Button/Button';

const StartScreen = () => {
	const navigate = useNavigate();
	const { role, updateUserData } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		if (role) {
			navigate('/profile');
		}
	}, [role, navigate]);

	useEffect(() => {
		if (role && !!isUpdated) {
			navigate('/profile');
		}
	}, [role, isUpdated, navigate]);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

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
		<div className='content-wrapper startscreen' id='start'>
			<h1>Привет.<br />Выбери роль!</h1>
			<div className='list gap-xl'>
				<div className='list-item'>
					<Button className='light size-xl w-100' icon='face_retouching_natural' onClick={() => handleRoleSelect('blogger')}>Блогер</Button>
				</div>
				<div className='list-item'>
					<Button className='light size-xl w-100' icon='store' onClick={() => handleRoleSelect('seller')}>Селлер</Button>
				</div>
			</div>
		</div>
	);
};

export default StartScreen;