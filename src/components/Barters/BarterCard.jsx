import React, { useEffect, useState } from 'react';
import './Barters.css';
import '../Store/Store.css';
import moment from 'moment';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useHelpers } from '../../hooks/useHelpers';

const BarterCard = ({ offer, onClick }) => {
	const { role } = useUserProfile();
	const { getOfferTitle } = useHelpers();

	const [title, setTitle] = useState('Статус');
	const [username, setUsername] = useState('');

	useEffect(() => {
		setTitle(getOfferTitle(offer.status, role));
		if (role === 'seller') {
			setUsername('@' + offer.blogger?.instagram_username);
		} else {
			setUsername(offer.barter.seller?.brand_instagram);
		}
	}, [offer, role])

	return (
		// <div
		// 	id={offer.id}
		// 	className='card product-card'
		// 	onClick={onClick}
		// >
		// 	<div
		// 		className={`product-image ${offer.product.photos && offer.product.photos.length > 0 ? '' : offer.product.placeholder ? 'loading' : 'default'}`}
		// 		style={{ backgroundImage: offer.product.photos && offer.product.photos.length > 0 ? `url(${offer.product.photos[0]})` : '' }}
		// 	>
		// 	</div>
		// 	<div className='product-content'>
		// 		{offer.product.placeholder ? (
		// 			<span className='product-title'>Загрузка...</span>
		// 		) : (
		// 			<span className='product-title'>{offer.product.title}</span>
		// 		)}
		// 	</div>
		// </div>
		<div
			id={offer.id}
			className='barter-card'
			onClick={onClick}
		>
			<div
				className={`barter-image product-image ${offer.product.photos && offer.product.photos.length > 0 ? '' : offer.product.placeholder ? 'loading' : 'default'}`}
				style={{ backgroundImage: offer.product.photos && offer.product.photos.length > 0 ? `url(${offer.product.photos[0]})` : '' }}
			/>
			<div className='product-content'>
		 		{offer.product.placeholder ? (
					<span className='product-title'>Загрузка...</span>
				) : (
					<>
						<small>{moment(offer.updated_at).format('DD.MM.YYYY, HH:mm')}</small>
						<div className='list'>
							<div className='list-item'>
								<h3>{title}</h3>
								<div className='barter-status'></div>
							</div>
							<div className='list-item barter-blogger-username'>
								{username}
							</div>
						</div>
						<span className='product-title'>{offer.product.title}</span>
					</>
				)}
			</div>
		</div>
	)
}

export default BarterCard;