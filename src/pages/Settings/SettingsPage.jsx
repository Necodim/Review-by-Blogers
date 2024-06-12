import packageJson from '../../../package.json';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import Input from '../../components/Form/Input';
import Button from '../../components/Button/Button';
import Link from '../../components/Button/Link';
import PopupConfirmation from '../../components/Popup/PopupConfirmation';

const SettingsPage = () => {
	const navigate = useNavigate();
	const { profile, updateProfile, updateUserData, addSubscription } = useUserProfile();
	const { isAvailable, showBackButton, user } = useTelegram();
	const { showToast } = useToastManager();

	const [isPopupChangeRoleVisible, setIsPopupChangeRoleVisible] = useState(false);
	const [currentRole, setCurrentRole] = useState(profile.role);
	const [newRole, setNewRole] = useState(profile.role);

	useEffect(() => {
		if (isAvailable) showBackButton();
	}, [isAvailable, showBackButton]);

	useEffect(() => {
		setCurrentRole(profile.role);
		setNewRole(profile.role);
	}, [profile.role]);

	// // Тестовый функционал
	// const goToStartScreen = () => {
	//     navigate('/');
	// }

	// // Тестовый функционал
	// const addSellerSubscription = async () => {
	//     const data = {
	//         yookassa_id: '39afc4a2-6325-475b-9980-c4323ed72fa6',
	//         amount_value: 10000,
	//         amount_currency: 'RUB'
	//     }
	//     const addedSubscription = await addSubscription(data);
	//     updateProfile({ subscription: addedSubscription });
	//     goToStartScreen();
	// }

	// // Тестовый функционал
	// const removeRole = async () => {
	//     await updateUserData({role: ''});
	//     setCurrentRole(newRole);
	//     updateProfile({ role: newRole });
	//     goToStartScreen();
	// }

	const radioOptions = [
		{ label: 'Селлер', value: 'seller', icon: 'store' },
		{ label: 'Блогер', value: 'blogger', icon: 'face_retouching_natural' },
	];

	const handleRadioChange = (value) => {
		if (profile.role !== value) {
			setNewRole(value);
			setIsPopupChangeRoleVisible(true);
		}
	}

	const closePopupWithoutChangeRole = () => {
		showToast('Роль не изменилась');
		setNewRole(currentRole);
		setIsPopupChangeRoleVisible(false);
	}

	const changeRole = async () => {
		try {
			await updateUserData({ role: newRole });
			updateProfile({ role: newRole });
			goToStartScreen();
		} catch (error) {
			showToast('Ошибка при обновлении роли', 'error');
		}
	}

	return (
		<div className='content-wrapper'>
			<div className='container' id='settings'>
				<div className='list'>
					<div className='list-item'>
						<h2>Настройки</h2>
					</div>
					<div className='list-item'>
						<small>{'Ваш ID: ' + profile.id}</small>
					</div>
				</div>
				{profile && profile.role &&
					<Input
						id='settings-role'
						title='Роль'
						type='radio'
						options={radioOptions}
						onChange={handleRadioChange}
						selectedValue={newRole}
					/>
				}
				<Button onClick={() => { navigate('/info/support') }} icon='support_agent'>Поддержка</Button>
				<Link onClick={() => { navigate('/info/user-agreement') }}>Пользовательское соглашение</Link>
				<small>Версия: {packageJson.version}</small>
			</div>


			{/* <div className='container' id='tests'>
				<h2>Тестовый функционал</h2>
				<span>Telergam username: {user?.username}</span>
				<Link onClick={goToStartScreen}>Стартовый экран</Link>
				<Link onClick={removeRole}>Удалить роль</Link>
				{profile && profile.role === 'seller' &&
					<Link onClick={addSellerSubscription}>Включить подписку (бесплатно)</Link>
				}
			</div> */}
			<PopupConfirmation
				id='popup-change-role-confirmation'
				title='Изменение роли'
				text='Вы действительно хотите изменить роль?'
				descr='После смены роли вы не потеряете свои данные. Её можно будет точно так же изменить в будущем через настройки.'
				isOpen={isPopupChangeRoleVisible}
				onClose={closePopupWithoutChangeRole}
				onConfirmation={changeRole}
				timer={4}
			/>
		</div>
	)
}

export default SettingsPage;
