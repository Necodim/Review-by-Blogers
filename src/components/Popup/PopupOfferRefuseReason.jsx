import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.js';
import { useToastManager } from '../../hooks/useToast.js'
import Popup from './Popup.jsx';
import Form from '../Form/Form.jsx';
import Textarea from '../Form/Textarea.jsx';

const PopupOfferRefuseReason = ({ isOpen, onClose }) => {
	const navigate = useNavigate();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [reason, setReason] = useState('');
	const [btnSubmit, setBtnSubmit] = useState('Отправить без причины');

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	const handleReasonChange = (e) => {
		const value = e.target.value;
		setReason(value);
		if (value !== '') {
			setBtnSubmit('Отправить');
		} else {
			setBtnSubmit('Отправить без причины');
		}
	}

	const resetForm = () => {
		setReason('');
		setBtnSubmit('Отправить без причины');
	}

	const submitForm = async (e) => {
		e.preventDefault();
		try {
      const refusedOffer = await api.refuseBarterOffer();
      showToast(refusedOffer.message, 'warning');
			onClose();
			setTimeout(() => resetForm(), 500);
			navigate('/barters');
		} catch (error) {
			console.error(error);
      setErrorMessage(error.message);
		}
	}

	return (
		<Popup id='popup-reason' isOpen={isOpen} onClose={onClose}>
			<h2>Причина отказа</h2>
			<div>Пожалуйста, расскажите, почему вы решили отказаться от предложения о бартере? Это поможет нам лучше понять потребности селлеров, а блоггер сможет исправить недочёты, если они касаются его самого.</div>
			<Form onSubmit={submitForm} btntext={btnSubmit}>
				<Textarea
					id='reason'
					name='reason'
					title='Причина отказа'
					placeholder='Укажите причину отказа...'
					comment='Поле не обязательно для заполнения'
					value={reason}
    			onChange={handleReasonChange}
				/>
			</Form>
		</Popup>
	);
};

export default PopupOfferRefuseReason;