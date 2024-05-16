import React from 'react';
import '../Store.css';

const ProductCardSeller = ({ product, isEditing, isSelected, onClick }) => {
	return (
		<div
			className={`card product-card ${isEditing ? (isSelected ? 'select' : 'unselect') : ''}`}
			onClick={onClick}
			data-product-id={product.nmid}
			data-product-brand={product.brand}
		>
			<div className='selection-point' />
			<div
				className={`product-image ${product.photos && product.photos.length > 0 ? '' : product.placeholder ? 'loading' : 'default'}`}
				style={{ backgroundImage: product.photos && product.photos.length > 0 ? `url(${product.photos[0]})` : '' }}
			>
				{!product.barter?.task && <div className={'task' + (product.barter?.task ? ' active' : '')}>{product.barter?.task ? 'Есть ТЗ' : 'Нет ТЗ'}</div>}
			</div>
			<div className='product-content'>
				{product.placeholder ? (
					<span className='product-title'>Загрузка...</span>
				) : (
					<span className='product-title'>{product.title}</span>
				)}
			</div>
		</div>
	)
}

export default ProductCardSeller;