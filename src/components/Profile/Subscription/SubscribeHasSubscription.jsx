import React, { useEffect, useState } from 'react';
import '../Profile.css';
import moment from 'moment';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Button from '../../Button/Button';

const SubscribeHasSubscription = () => {
	const { profile, cancelSubscription } = useUserProfile();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [expiredDate, setExpiredDate] = useState('');

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

	const cancellingSubscription = async () => {
		await cancelSubscription();
	}

	return (
		<div className='content-wrapper'>
			<Header />
			<div className='container' id='subscribe'>
				<div className='list'>
					<div className='list-item'>
						<h2>У вас есть подписка</h2>
					</div>
					<div className='list-item'>
						<p>Следующее списание {expiredDate}</p>
					</div>
				</div>
				<div className='list'>
					<div className='list-item'>
						<Button className='error w-100' onClick={cancellingSubscription}>Отменить подписку</Button>
          </div>
				</div>
			</div>
		</div>
	)
}

export default SubscribeHasSubscription