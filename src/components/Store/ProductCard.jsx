import React from 'react';
import './Store.css';
import { useUserProfile } from '../../hooks/UserProfileContext';
import ProductCardSeller from './Seller/ProductCardSeller';
import ProductCardBlogger from './Blogger/ProductCardBlogger';

const ProductCard = ({ product, isEditing, isSelected, onClick }) => {
	const { role } = useUserProfile();

	if (role === 'seller') {
		return <ProductCardSeller
			product={product}
			isEditing={isEditing}
			isSelected={isSelected}
			onClick={onClick}
		/>
	} else {
		return <ProductCardBlogger
			product={product}
			onClick={onClick}
		/>
	}
}

export default ProductCard;