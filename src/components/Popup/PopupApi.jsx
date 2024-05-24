import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useEvents } from '../../hooks/useEvents';
import { useToastManager } from '../../hooks/useToast';
import Popup from "./Popup"
import Link from '../Button/Link';
import Form from '../Form/Form';
import Input from '../Form/Input';
import imgInstruction1 from '../../images/instruction-1.png';
import imgInstruction2 from '../../images/instruction-2.png';
import imgInstruction3 from '../../images/instruction-3.png';
import imgInstruction4 from '../../images/instruction-4.png';

const PopupApi = (props) => {
	const { handleFocus } = useEvents();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [token, setToken] = useState('');
	const [isValid, setIsValid] = useState(null);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [display, setDisplay] = useState('none');
	const [contentHeight, setContentHeight] = useState(0);
	const ref = useRef(null);

	useEffect(() => {
		if (errorMessage && attemptedSubmit) {
			showToast(errorMessage, 'error');
			setAttemptedSubmit(false);
			setErrorMessage('');
		}
	}, [errorMessage, attemptedSubmit, showToast]);

	useEffect(() => {
		const validateJWT = (token) => {
			if (token.length > 0 && token.trim() !== '') {
				const parts = token.split('.');
				if (parts.length !== 3) {
					setErrorMessage('Неверный формат JWT');
					return false;
				}
		
				try {
					const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
					const now = Date.now() / 1000;
					if (payload.exp && payload.exp < now) {
						setErrorMessage('Этот токен истек, создайте новый');
						return false;
					}
					return true;
				} catch (error) {
					setErrorMessage('Ошибка при декодировании или чтении API-ключа. Скорее всего допущена ошибка.');
					return false;
				}
			} else {
				return false;
			}
		}
		setErrorMessage('');
		setIsValid(validateJWT(token));
	}, [token]);

	useEffect(() => {
		if (!props.isOpen) {
			setToggle(false);
		}
	}, [props.isOpen]);


	useLayoutEffect(() => {
		if (ref.current) {
			setContentHeight(ref.current.clientHeight);
		}
	}, [toggle]);

	const animation = useSpring({
		from: { height: 0, opacity: 0, marginTop: '0px', width: '100%' },
		to: {
			height: toggle ? contentHeight : 0,
			opacity: toggle ? 1 : 0,
			marginTop: toggle ? '8px' : '0px',
		},
		onStart: () => {
			if (toggle) setDisplay('block');
		},
		onRest: () => {
			if (!toggle) setDisplay('none');
		},
		config: { duration: 300 },
	});

	const toggleVisibility = () => {
		if (!toggle) {
			setDisplay('block');
		}
		setToggle(!toggle);
	}

	const handleApiChange = (event) => {
		setAttemptedSubmit(false);
		const { value } = event.target;
		setToken(value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		setAttemptedSubmit(true);
		if (isValid) {
			props.onSubmit(event);
			if (props.onSuccess) {
				props.onSuccess();
			}
		}
	}

	return (
		<Popup id={props.id} isOpen={props.isOpen} onClose={props.onClose} {...props}>
			<div className='list'>
				<div className='list-item'>
					<h2>API-ключ</h2>
					<Link onClick={toggleVisibility}>Где взять?</Link>
				</div>
				<animated.div className='list-item' style={{ ...animation, display }}>
					<div ref={ref} className='hint-wrapper list'>
						<div className='list-item vertical'>
							<p>Войдите в настройки профиля.</p>
							<img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction1} />
						</div>
						<div className='list-item vertical'>
							<p>Откройте вкладку «Доступ к API» и нажмите кнопку «Создать новый токен».</p>
							<img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction2} />
						</div>
						<div className='list-item vertical'>
							<p>Задайте имя токена, поставьте галочку «Только на чтение...», выберите «Контент» и нажмите кнопку «Создать токен». Чтобы не запутаться в будущем, рекомендуем дать имя «review-by-bloggers», так вы будете понимать, для какого сервиса создали токен.</p>
							<img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction3} />
						</div>
						<div className='list-item vertical'>
							<p>Скопируйте токен, вставьте в поле ниже и нажмите «Сохранить».</p>
							<img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction4} />
						</div>
					</div>
				</animated.div>
			</div>
			<Form className='form-wrapper' btnicon='save' btntext='Сохранить' isDisabled={!isValid} onSubmit={handleSubmit}>
				<Input
					id='input-token'
					name='token'
					title='Введите API-ключ'
					icon='backspace'
					iconCallback={() => {setToken('')}}
					fade={true}
					placeholder='eyJhbGciOiJ...'
					value={token}
					onChange={handleApiChange}
					onFocus={handleFocus}
					error={errorMessage}
				/>
			</Form>
			<small>Если у вас до этого уже были загружены товары в наше приложение, их данные обновятся.</small>
		</Popup>
	)
}

export default PopupApi