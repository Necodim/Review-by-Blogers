import React from 'react';
import './Barters.css';
import '../Store/Store.css';

const BarterCard = ({ barter, onClick }) => {
	return (
		<div
		id={barter.offer?.id}
		className='card product-card'
		onClick={onClick}
		>
			<div
				className={`product-image ${barter.product.photos && barter.product.photos.length > 0 ? '' : barter.product.placeholder ? 'loading' : 'default'}`}
				style={{ backgroundImage: barter.product.photos && barter.product.photos.length > 0 ? `url(${barter.product.photos[0]})` : '' }}
			>
			</div>
			<div className='product-content'>
				{barter.product.placeholder ? (
					<span className='product-title'>Загрузка...</span>
				) : (
					<span className='product-title'>{barter.product.title}</span>
				)}
			</div>
		</div>
	)
}

export default BarterCard;