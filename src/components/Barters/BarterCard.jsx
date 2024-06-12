import React, { useEffect, useState } from 'react';
import './Barters.css';
import '../Store/Store.css';
import moment from 'moment';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useHelpers } from '../../hooks/useHelpers';

const BarterCard = ({ barter, onClick }) => {
	const { role } = useUserProfile();
	const { getBarterTitle } = useHelpers();

	const [title, setTitle] = useState('Статус');
	const [username, setUsername] = useState('');

	useEffect(() => {
		setTitle(getBarterTitle(barter.offer?.status, role));
		if (role === 'seller') {
			setUsername('@' + barter.offer?.instagram_username);
		} else {
			setUsername(barter.brand_instagram);
		}
		console.log(barter)
	}, [barter, role])

	return (
		// <div
		// 	id={barter.offer?.id}
		// 	className='card product-card'
		// 	onClick={onClick}
		// >
		// 	<div
		// 		className={`product-image ${barter.product.photos && barter.product.photos.length > 0 ? '' : barter.product.placeholder ? 'loading' : 'default'}`}
		// 		style={{ backgroundImage: barter.product.photos && barter.product.photos.length > 0 ? `url(${barter.product.photos[0]})` : '' }}
		// 	>
		// 	</div>
		// 	<div className='product-content'>
		// 		{barter.product.placeholder ? (
		// 			<span className='product-title'>Загрузка...</span>
		// 		) : (
		// 			<span className='product-title'>{barter.product.title}</span>
		// 		)}
		// 	</div>
		// </div>
		<div
			id={barter.offer?.id}
			className='barter-card'
			onClick={onClick}
		>
			<div
				className={`barter-image product-image ${barter.product.photos && barter.product.photos.length > 0 ? '' : barter.product.placeholder ? 'loading' : 'default'}`}
				style={{ backgroundImage: barter.product.photos && barter.product.photos.length > 0 ? `url(${barter.product.photos[0]})` : '' }}
			/>
			<div className='product-content'>
		 		{barter.product.placeholder ? (
					<span className='product-title'>Загрузка...</span>
				) : (
					<>
						<small>{moment(barter.offer?.updated_at).format('DD.MM.YYYY, HH:mm')}</small>
						<div className='list'>
							<div className='list-item'>
								<h4>{title}</h4>
								<div className='barter-status'></div>
							</div>
							<div className='list-item barter-blogger-username'>
								{username}
							</div>
						</div>
						<span className='product-title'>{barter.product.title}</span>
					</>
				)}
			</div>
		</div>
	)
}

export default BarterCard;