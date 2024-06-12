import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import { useTelegram } from "../../hooks/useTelegram";
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const StartScreen = () => {
	const navigate = useNavigate();
	const { role, updateUserData } = useUserProfile();
	const { tg, isAvailable, hideBackButton } = useTelegram();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		if (isAvailable) hideBackButton();
	}, [isAvailable, hideBackButton]);

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
	}, [role, isUpdated]);

	useEffect(() => {
		if (role) {
			navigate('/profile');
		}
	}, [role]);

	const handleRoleSelect = async (role) => {
		try {
			const result = await updateUserData({ role: role });
			setIsUpdated(true);
		} catch (error) {
			const errorText = 'Произошла ошибка при выборе роли пользователя';
			setErrorMessage(errorText);
			console.error(`${errorText}:`, error);
			isAvailable() ? tg.showAlert(errorText + '. Попробуйте ещё раз.') : alert(errorText);
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