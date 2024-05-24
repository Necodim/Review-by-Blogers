import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.js';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import { useToastManager } from '../../hooks/useToast.js'
import Popup from './Popup.jsx';
import Form from '../Form/Form.jsx';
import Textarea from '../Form/Textarea.jsx';
import Input from '../Form/Input.jsx';

const PopupTaskWrite = ({ isOpen, onClose, selectedProducts }) => {
	const navigate = useNavigate();
	const { profile } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [task, setTask] = useState('');
	const [brandInstagram, setBrandInstagram] = useState('');
	const [feedback, setFeedback] = useState(false);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	const handleTaskChange = (e) => setTask(e.target.value);
	const handleBrandInstagramChange = (e) => {
		let value = e.target.value;
		value = value.replace(/@|https?:\/\/(www\.)?instagram\.com\//g, '');
		setBrandInstagram(value);
	};
	const handleFeedbackChange = (e) => setFeedback(e.target.checked);

	const resetForm = () => {
		setTask('');
		setBrandInstagram('');
		setFeedback(false);
	}

	const submitForm = async (e) => {
		e.preventDefault();
		if (selectedProducts.length > 0) {
			const data = {
				products: selectedProducts,
				task: task,
				brandInstagram: brandInstagram,
				needFeedback: feedback,
				// maxResponses: null,
			}
			try {
				const barters = await api.createBarters(data);
				const message = barters.length > 1 ? 'Вы успешно создали бартеры для товаров' : 'Вы успешно создали бартер для товара';
				showToast(message, 'success');
				onClose();
				setTimeout(() => resetForm(), 500);
				navigate('/store');
			} catch (error) {
				const message = selectedProducts.length > 1 ? 'Не удалось создать бартеры для товаров' : 'Не удалось создать бартер для товара';
				setErrorMessage(message)
				console.error(`${message}:`, error);
			}
		} else {
			setErrorMessage('Нет выбранного(-ых) товара(-ов) для создания бартера(-ов)');
		}
	}

	return (
		<Popup id='popup-write-task' isOpen={isOpen} onClose={onClose}>
			<h2>Техническое задание</h2>
			<div>Что блогер должен сказать о товаре?</div>
			<Form onSubmit={submitForm} btntext='Сохранить' btnicon='save'>
				<Textarea
					id='task'
					name='task'
					title='Описание'
					value={task}
    			onChange={handleTaskChange}
					placeholder='Необходимо распаковать товар на камеру и...'
				/>
				<Input
					id='brand-instagram'
					name='brand-instagram'
					title='Instagram бренда, если есть'
					placeholder='username'
					value={brandInstagram}
					onChange={handleBrandInstagramChange}
					comment='Укажите аккаунт вашего бренда в Instagram, если хотите, чтобы блогер вас отметил'
				/>
				<Input
					type='checkbox'
					id='feedback'
					name='feedback'
					title='Сбор отзывов'
					label='Отметьте, если хотите, чтобы блогер обязательно оставил отзыв'
					checked={feedback}
					onChange={handleFeedbackChange}
				/>
			</Form>
			{/* <small>Укажите аккаунт бренда в instagram, если хотите, чтобы блогер вас отметил</small>
            <small>Отметьте, если хотите, чтобы блогер оставил отзыв</small> */}
		</Popup>
	);
};

export default PopupTaskWrite;
