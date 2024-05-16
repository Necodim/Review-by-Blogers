import React from 'react';
import '../Store.css';

const ProductCardBlogger = ({ product, onClick }) => {
	return (
		<div
			className='card product-card'
			onClick={onClick}
			data-product-id={product.nmid}
			data-product-brand={product.brand}
		>
			<div
				className={`product-image ${product.photos && product.photos.length > 0 ? '' : product.placeholder ? 'loading' : 'default'}`}
				style={{ backgroundImage: product.photos && product.photos.length > 0 ? `url(${product.photos[0]})` : '' }}
			>
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

export default ProductCardBlogger;