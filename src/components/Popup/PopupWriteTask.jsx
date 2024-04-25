import React, { useState } from 'react';
import api from '../../api/api';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import { useToastManager } from '../../hooks/useToast'
import Popup from './Popup';
import Form from '../Form/Form';
import Textarea from '../Form/Textarea';
import Input from '../Form/Input';

const PopupWriteTask = ({ isOpen, onClose, selectedProducts }) => {
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

	const submitForm = async (e) => {
		e.preventDefault();
		if (selectedProducts.length > 0) {
			const data = {
				userId: profile.id,
				products: selectedProducts,
				task: task,
				brandInstagram: brandInstagram,
				needFeedback: feedback,
				// maxResponses: null
			}
			try {
				const barter = await api.createBarters(data);
				console.log(barter);
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
					placeholder='Необходимо распаковать товар на камеру и...'
				>{task}</Textarea>
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

export default PopupWriteTask;
