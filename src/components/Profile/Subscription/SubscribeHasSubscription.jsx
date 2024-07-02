import React, { useEffect, useState } from 'react';
import '../Profile.css';
import moment from 'moment';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Heading1 from '../../Barters/Heading/Heading1';
import Button from '../../Button/Button';

const SubscribeHasSubscription = () => {
	const { cancelSellerSubscription } = api;
	const { profile, updateProfile } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [expiredDate, setExpiredDate] = useState('');
	const [isBtnDisabled, setIsBtnDisabled] = useState(false);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	useEffect(() => {
		if (profile.subscription?.expired_at) {
			setExpiredDate(moment(profile.subscription?.expired_at).format('DD.MM.YYYY в HH:mm'));
		}
	}, [profile]);

	const cancelSubscription = async () => {
		setIsBtnDisabled(true);
		try {
			const result = await cancelSellerSubscription();
			updateProfile({ subscription: result });
			showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.next_charge_date).format('DD.MM.YYYY, HH:mm')}.`, 'success');
			navigate('/profile');
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setIsBtnDisabled(false);
		}
	}

	return (
		<div className='content-wrapper'>
			<Header />
			<div className='container' id='subscribe'>
				<Heading1 title='У вас есть подписка'>
					<div className='list-item'>
						<p>Следующее списание {expiredDate}</p>
					</div>
				</Heading1>
				<div className='list'>
					<div className='list-item'>
						<Button className='error w-100' disabled={isBtnDisabled} onClick={cancelSubscription}>Отменить подписку</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SubscribeHasSubscription