import React, { useEffect, useState } from 'react';
import Popup from './Popup.jsx';
import { useToastManager } from '../../hooks/useToast.js';
import { useHelpers } from '../../hooks/useHelpers.js';
import Heading1 from '../Barters/Heading/Heading1.jsx';
import Quote from '../Quote/Quote.jsx';
import Button from '../Button/Button.jsx';
import Input from '../Form/Input.jsx';

const PopupTaskRead = ({ isOpen, onClose, barter, onEdit }) => {
	const { showToast } = useToastManager();
	const { copyToClipboard } = useHelpers();
	
	const [errorMessage, setErrorMessage] = useState('');
	
	useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

	const handleCopyBrandInstagram = () => {
		const result = copyToClipboard(`@${barter.brand_instagram}`, 'Вы успешно скопировали аккаунт', 'Не удалось скопировать аккаунт');
		showToast(result.message, result.status);
	}

	return (
		<Popup id='popup-task' isOpen={isOpen} onClose={onClose}>
			<Heading1 title='Техническое задание'>
				{barter?.task &&
					<>
						<div className='list-item'>
							<h2>Текст задания</h2>
						</div>
						<div className='list-item'>
							<Quote>{barter.task}</Quote>
						</div>
					</>
				}
			</Heading1>
			{(barter.brand_instagram || barter.need_feedback) && 
				<div className='list'>
					<div className='list-item'>
						<h2>Дополнительные требования</h2>
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
								iconCallback={handleCopyBrandInstagram}
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