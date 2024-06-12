import React from 'react';
import Popup from './Popup.jsx';
import { useHelpers } from '../../hooks/useHelpers.js';
import Quote from '../Quote/Quote.jsx';
import Button from '../Button/Button.jsx';
import Input from '../Form/Input.jsx';

const PopupTaskRead = ({ isOpen, onClose, barter, onEdit }) => {
	const { copyToClipboard } = useHelpers();

	return (
		<Popup id='popup-task' isOpen={isOpen} onClose={onClose}>
			<div className='list'>
				<div className='list-item'>
					<h2>Техническое задание</h2>
				</div>
				{barter?.task &&
					<>
						<div className='list-item'>
							<h3>Текст задания</h3>
						</div>
						<div className='list-item'>
							<Quote>{barter.task}</Quote>
						</div>
					</>
				}
			</div>
			{(barter.brand_instagram || barter.need_feedback) && 
				<div className='list'>
					<div className='list-item'>
						<h3>Дополнительные требования</h3>
					</div>
					{barter.brand_instagram && 
						<div className='list-item'>
							<Input
								id='brand-instagram'
								name='brand-instagram'
								title='Укажите аккаунт бренда'
								placeholder={barter.brand_instagram}
								value={barter.brand_instagram}
								readOnly={true}
								icon={'copy'}
								iconCallback={() => { copyToClipboard(`@${barter.brand_instagram}`, 'Вы успешно скопировали аккаунт', 'Не удалось скопировать аккаунт')}}
								fade={true}
							/>
						</div>
					}
					{barter.need_feedback && 
						<div className='list-item'>
							<Input 
								className='list-item'
								type='checkbox'
								label='Обязательно оставьте отзыв к товару на маркетплейсе после покупки'
								checked={true}
								readOnly={true}
							/>
						</div>
					}
				</div>
			}
			{!!onEdit && <Button className='w-100' icon='edit' onClick={onEdit}>Редактировать</Button>}
		</Popup>
	);
};

export default PopupTaskRead;