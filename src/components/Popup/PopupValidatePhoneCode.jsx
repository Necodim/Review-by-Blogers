import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.js';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import { useToastManager } from '../../hooks/useToast.js'
import Popup from './Popup.jsx';
import Form from '../Form/Form.jsx';
import Input from '../Form/Input.jsx';

const PopupValidatePhoneCode = ({ isOpen, onClose }) => {
	const navigate = useNavigate();

	const { getUserData } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [code, setCode] = useState('');
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	const handleCodeChange = (e) => {
		const value = e.target.value;
		setCode(value);
		setIsSubmitDisabled(value.length !== 4);
	}

	const submitForm = async (e) => {
		e.preventDefault();
		setIsSubmitDisabled(true);
		try {
			const result = await api.getUserAuthByPhoneCode(code);
			console.log(result)
			showToast(result.message, 'success');
			await getUserData();
			onClose();
			setTimeout(() => {
				setCode('');
			}, 500);
			navigate('/profile');
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setIsSubmitDisabled(false);
		}
	}

	return (
		<Popup id='popup-validate-phone-code' isOpen={isOpen} onClose={onClose}>
			<h1>Проверка номера телефона</h1>
			<Form
				onSubmit={submitForm}
				btntext='Проверить'
				isDisabled={isSubmitDisabled}
			>
				<Input
					type='number'
					id='code'
					name='code'
					pattern='\d*'
					title='Последние 4 цифры'
					placeholder='1234'
					value={code}
    			onChange={handleCodeChange}
					icon='tag'
					fade={true}
				/>
			</Form>
		</Popup>
	);
};

export default PopupValidatePhoneCode;