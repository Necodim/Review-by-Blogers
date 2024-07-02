import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';
import { useHelpers } from '../../../hooks/useHelpers.js';
import { useToastManager } from '../../../hooks/useToast.js';
import { useUserProfile } from '../../../hooks/UserProfileContext.js';
import Header from '../../Header/Header.jsx';
import Heading1 from '../../Barters/Heading/Heading1.jsx';
import ProfileFooter from '../ProfileFooter.jsx';
import Button from '../../Button/Button.jsx';
import BrandsList from '../../BrandList/BrandList.jsx';

const ProfileSeller = () => {
	const navigate = useNavigate();
	const { profile } = useUserProfile();
	const { getPlural } = useHelpers();
	const { showToast } = useToastManager();

	const [errorMessage, setErrorMessage] = useState('');
	const [isApi, setIsApi] = useState(false);
	const [canAddApi, setCanAddApi] = useState('');
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isAvaliable, setIsAvaliable] = useState(false);
	const [totalProducts, setTotalProducts] = useState(0);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, 'error');
			setErrorMessage('');
		}
	}, [errorMessage, showToast]);

	useEffect(() => {
		if (profile) {
			setIsSubscribed(profile.subscription?.active);
			setIsAvaliable(profile.subscription?.avaliable);
			setCanAddApi(profile.trial?.active && profile.trial['barters-left'] > 0);
			if (profile.subscription && (profile.subscription.active || profile.subscription.avaliable)) {
				setCanAddApi(true);
			}
		}
	}, [profile]);

	useEffect(() => {
		setIsApi(!!profile.api?.wildberries?.token);
	}, [profile.api?.wildberries?.token]);

	const goToSubscriptionPage = () => {
		if (isSubscribed) {
			showToast('У вас уже есть подписка', 'info');
		}
		navigate('/profile/subscription');
	}

	return (
		<div className='content-wrapper'>
			<Header />
			<div className='container' id='profile'>
				<Heading1
					title={isSubscribed ? 'Подписка' : isAvaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробный период' : 'Нет подписки'}
					text={!isSubscribed && !isAvaliable && canAddApi && <small>{`Еще ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}`}</small>}
				/>
				<div className='list'>
					<Button className={'list-item' + (!isApi && ' success')} icon='key' onClick={ () => { navigate('/profile/api') } } disabled={!canAddApi}>{`${isApi ? 'Изменить' : 'Добавить'} API-ключ`}</Button>
					<Button className={'list-item' + (!isSubscribed && isApi && ' success')} icon='account_balance_wallet' onClick={goToSubscriptionPage}>Подписка</Button>
					<Button className='list-item' icon='notifications' onClick={() => { navigate('/profile/notifications') } }>Уведомления</Button>
					<Button className='list-item' icon='handshake' onClick={() => { navigate('/profile/referral') } }>Партнёрская программа</Button>
					<Button className='list-item' icon='verified_user' disabled={!!profile.phone} onClick={() => { navigate('/profile/verification') } }>Верификация</Button>
				</div>
			</div>
			{(isSubscribed || isAvaliable || profile.trial?.active) && profile.api?.wildberries?.token &&
				<div className='container' id='brands' >
					<Heading1
						title='Мои бренды'
						text={<small>{`${totalProducts} ${getPlural(totalProducts, 'товар', 'товара', 'товаров')}`}</small>}
					/>
					<BrandsList setTotalProducts={setTotalProducts} />
				</div>
			}
			<ProfileFooter />
		</div>
	);
};

export default ProfileSeller;