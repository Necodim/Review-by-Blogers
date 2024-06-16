import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';
import moment from 'moment';
import api from '../../../api/api.js';
import { useHelpers } from '../../../hooks/useHelpers.js';
import { useToastManager } from '../../../hooks/useToast.js';
import { useUserProfile } from '../../../hooks/UserProfileContext.js';
import Header from '../../Header/Header.jsx';
import ProfileFooter from '../ProfileFooter.jsx';
import Button from '../../Button/Button.jsx';
import Link from '../../Button/Link.jsx';
import BrandsList from '../../BrandList/BrandList.jsx';
import PopupApi from '../../Popup/PopupApi.jsx';

const ProfileSeller = () => {
	const navigate = useNavigate();
	const { profile, updateProfile, cancelSubscription } = useUserProfile();
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

	const goToSetApi = () => {
		navigate('/profile/api');
	}

	return (
		<div className='content-wrapper'>
			<Header />
			<div className='container' id='profile'>
				<div className='list'>
					<div className='list-item'>
						<h1>{isSubscribed ? 'Подписка' : isAvaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробный период' : 'Нет подписки'}</h1>
						{!isAvaliable && canAddApi &&
							<small>{`Еще ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}`}</small>
						}
					</div>
				</div>
				<div className='list'>
					<Button className='list-item' onClick={goToSubscriptionPage}>Подписка</Button>
					{canAddApi &&
						<Button className='list-item' onClick={goToSetApi}>{`${isApi ? 'Изменить' : 'Добавить'} API-ключ`}</Button>
					}
				</div>
			</div>
			{(isSubscribed || isAvaliable || profile.trial?.active) && profile.api?.wildberries?.token &&
				<div className='container' id='brands' >
					<div className='list'>
						<div className='list-item'>
							<h1>Мои бренды</h1>
							<small>{`${totalProducts} ${getPlural(totalProducts, 'товар', 'товара', 'товаров')}`}</small>
						</div>
					</div>
					<BrandsList setTotalProducts={setTotalProducts} />
				</div>
			}
			<ProfileFooter />
		</div>
	);
};

export default ProfileSeller;