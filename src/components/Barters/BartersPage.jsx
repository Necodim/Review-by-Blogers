import React, { useEffect } from 'react';
import BloggerBartersPage from './Blogger/BloggerBartersPage';
import SellerBartersPage from './Seller/SellerBartersPage';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useTelegram } from '../../hooks/useTelegram';

const BartersPage = () => {
	const { role } = useUserProfile();
	const { isAvailable, hideBackButton } = useTelegram();

	useEffect(() => {
		if (isAvailable) hideBackButton();
	}, [isAvailable, hideBackButton]);

	return (
		<>
			{role === 'seller' ? <SellerBartersPage /> : <BloggerBartersPage />}
		</>
	);
}

export default BartersPage;


// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import './Barters.css'
// import api from '../../api/api';
// import { useUserProfile } from '../../hooks/UserProfileContext';
// import { useTelegram } from '../../hooks/useTelegram'
// import { useToastManager } from '../../hooks/useToast';
// import Header from '../Header/Header';
// import Preloader from '../Preloader/Preloader';
// import Link from '../Button/Link';
// import Icon from '../Icon/Icon';

// const BartersPage = (props) => {
// 	const { profile, loading } = useUserProfile();

// 	const { isAvailable, hideBackButton } = useTelegram();

// 	const initialBarterNewPlaceholder = new Array(2).fill({}).map((_, index) => ({
// 		placeholder: true,
// 		id: `id-${index}`,
// 	}));
// 	const initialBarterCurrentPlaceholder = new Array(2).fill({}).map((_, index) => ({
// 		placeholder: true,
// 		id: `id-${index}`,
// 	}));
// 	const initialBarterHistoryPlaceholder = new Array(6).fill({}).map((_, index) => ({
// 		placeholder: true,
// 		id: `id-${index}`,
// 		date: '11.02.2024',
// 		blogger: {
// 			'instagram-username': '@snezone'
// 		},
// 		product: {
// 			title: 'Загрузка названия товара',
// 		}
// 	}));

// 	const [bartersNew, setBartersNew] = useState(initialBarterNewPlaceholder);
// 	const [bartersNewIsLoading, setBartersNewIsLoading] = useState(true);
// 	const [bartersCurrent, setBartersCurrent] = useState(initialBarterCurrentPlaceholder);
// 	const [bartersCurrentIsLoading, setBartersCurrentIsLoading] = useState(true);
// 	const [bartersHistory, setBartersHistory] = useState(initialBarterHistoryPlaceholder);
// 	const [bartersHistoryIsLoading, setBartersHistoryIsLoading] = useState(true);
// 	const [errorMessage, setErrorMessage] = useState('');

// 	const { showToast } = useToastManager();

// 	useEffect(() => {
// 		if (isAvailable) hideBackButton();
// 	}, [isAvailable, hideBackButton]);

// 	useEffect(() => {
// 		if (errorMessage) {
// 			showToast(errorMessage, 'error');
// 			setErrorMessage('');
// 		}
// 	}, [errorMessage, showToast]);

// 	useEffect(() => {
// 		const fetchBartersNew = async () => {
// 			try {
// 				const fetchedBartersNew = await api.getBartersNewByUserId(profile.id);
// 				console.log(fetchedBartersNew)
// 				if (bartersNewIsLoading && Array.isArray(fetchedBartersNew) && !!fetchedBartersNew.length) {
// 					setBartersNew(fetchedBartersNew);
// 				} else {
// 					throw new Error('Произошла ошибка при получении списка новых бартеров');
// 				}
// 			} catch (error) {
// 				setErrorMessage(error.message);
// 			} finally {
// 				setBartersNewIsLoading(false);
// 			}
// 		}
// 		const fetchBartersCurrent = async () => {
// 			try {
// 				const fetchedBartersCurrent = await api.getBartersCurrentByUserId(profile.id);
// 				console.log(fetchedBartersCurrent)
// 				if (bartersCurrentIsLoading && Array.isArray(fetchedBartersCurrent) && !!fetchedBartersCurrent.length) {
// 					setBartersCurrent(fetchedBartersCurrent);
// 				} else {
// 					throw new Error('Произошла ошибка при получении списка бартеров в работе');
// 				}
// 			} catch (error) {
// 				setErrorMessage(error.message);
// 			} finally {
// 				setBartersCurrentIsLoading(false);
// 			}
// 		}
// 		if (!loading) {
// 			fetchBartersNew();
// 			fetchBartersCurrent();
// 		} else {
// 			return <Preloader>Загружаюсь...</Preloader>;
// 		}
// 	}, [loading, profile]);

// 	const navigate = useNavigate();

// 	const openBarter = (id) => {
// 		navigate(`${id}`);
// 	}

// 	const barterSeller = () => {
// 		return (

// 			<div className='content-wrapper'>
// 				<Header />
// 				<div className='container' id='barter-new' >
// 					<div className='list'>
// 						<div className='list-item'>
// 							<h2>Новые заявки</h2>
// 							<Link onClick={() => { }}>Ещё</Link>
// 						</div>
// 					</div>
// 					<div className='cards'>
// 						{bartersNew.map((barter, index) => (
// 							<div
// 								key={barter.id}
// 								className='card product-card'
// 								onClick={() => { openBarter(barter.id) }}
// 								data-barter-id={barter.id}
// 							>
// 								<div
// 									className={`product-image ${barter.product?.photos && barter.product?.photos.length > 0 ? '' : bartersNewIsLoading || barter.placeholder ? 'loading' : 'default'}`}
// 									style={{ backgroundImage: barter.product?.photos && barter.product?.photos.length > 0 ? `url(${barter.product?.photos[0]})` : '' }}
// 								></div>
// 								<div className='product-content'>
// 									{barter.placeholder ? (<span className='product-title'>Загрузка...</span>) : (<span className='product-title'>{barter.product?.title}</span>)}
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 				<div className='container' id='barter-current' >
// 					<div className='list'>
// 						<div className='list-item'>
// 							<h2>В работе</h2>
// 							<Link onClick={() => { }}>Ещё</Link>
// 						</div>
// 					</div>
// 					<div className='cards'>
// 						{bartersCurrent.map((barter, index) => (
// 							<div
// 								key={barter.id}
// 								className='card product-card'
// 								onClick={() => { openBarter(barter.id) }}
// 								data-barter-id={barter.id}
// 							>
// 								<div
// 									className={`product-image ${barter.product?.photos && barter.product?.photos.length > 0 ? '' : bartersCurrentIsLoading || barter.placeholder ? 'loading' : 'default'}`}
// 									style={{ backgroundImage: barter.product?.photos && barter.product?.photos.length > 0 ? `url(${barter.product?.photos[0]})` : '' }}
// 								></div>
// 								<div className='product-content'>
// 									{barter.placeholder ? (<span className='product-title'>Загрузка...</span>) : (<span className='product-title'>{barter.product?.title}</span>)}
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 				<div className='container' id='barter-history' >
// 					<div className='list'>
// 						<div className='list-item'>
// 							<h2>История</h2>
// 							<Link onClick={() => { }}>Ещё</Link>
// 						</div>
// 					</div>
// 					<div className='list'>
// 						{bartersHistory.map((barter, index) => (
// 							<div
// 								key={barter.id}
// 								className='list-item barter-card-wrapper'
// 								onClick={() => { openBarter(barter.id) }}
// 								data-barter-id={barter.id}
// 							>
// 								<div className='list list-item vertical barter-card'>
// 									<div className='list-item barter-title'>{barter.product?.title}</div>
// 									<div className='list list-item barter-content'>
// 										<small>{barter.date}</small>
// 										<small>{barter.blogger?.['instagram-username']}</small>
// 									</div>
// 								</div>
// 								<Icon icon='sync' className='self-start' />
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}

// 	const barterBlogger = () => {
// 		return (
// 			<div className='content-wrapper'>
// 				<Header />
// 				<div className='container' id='barter-current' >
// 					<div className='list'>
// 						<div className='list-item'>
// 							<h2>В работе</h2>
// 							<Link onClick={() => { }}>Ещё</Link>
// 						</div>
// 					</div>
// 					<div className='cards'>
// 						{bartersCurrent.map((barter, index) => (
// 							<div
// 								key={barter.id}
// 								className='card product-card'
// 								onClick={() => { openBarter(barter.id) }}
// 								data-barter-id={barter.id}
// 							>
// 								<div
// 									className={`product-image ${barter.product?.photos && barter.product?.photos.length > 0 ? '' : bartersCurrentIsLoading || barter.placeholder ? 'loading' : 'default'}`}
// 									style={{ backgroundImage: barter.product?.photos && barter.product?.photos.length > 0 ? `url(${barter.product?.photos[0]})` : '' }}
// 								></div>
// 								<div className='product-content'>
// 									{barter.placeholder ? (<span className='product-title'>Загрузка...</span>) : (<span className='product-title'>{barter.product?.title}</span>)}
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 				<div className='container' id='barter-history' >
// 					<div className='list'>
// 						<div className='list-item'>
// 							<h2>История</h2>
// 							<Link onClick={() => { }}>Ещё</Link>
// 						</div>
// 					</div>
// 					<div className='list'>
// 						{bartersHistory.map((barter, index) => (
// 							<div
// 								key={barter.id}
// 								className='list-item barter-card-wrapper'
// 								onClick={() => { openBarter(barter.id) }}
// 								data-barter-id={barter.id}
// 							>
// 								<div className='list list-item vertical barter-card'>
// 									<div className='list-item barter-title'>{barter.product?.title}</div>
// 									<div className='list list-item barter-content'>
// 										<small>{barter.date}</small>
// 										<small>{barter.blogger?.['instagram-username']}</small>
// 									</div>
// 								</div>
// 								<Icon icon='sync' className='self-start' />
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}

// 	if (profile.role === 'seller') {
// 		return barterSeller();
// 	} else if (profile.role === 'blogger') {
// 		return barterBlogger();
// 	}
// }

// export default BartersPage