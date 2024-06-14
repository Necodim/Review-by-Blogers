import React from 'react';
import BloggerBartersPage from './Blogger/BloggerBartersPage';
import SellerBartersPage from './Seller/SellerBartersPage';
import { useUserProfile } from '../../hooks/UserProfileContext';

const BartersPage = () => {
	const { role } = useUserProfile();

	return (
		<>
			{role === 'seller' ? <SellerBartersPage /> : <BloggerBartersPage />}
		</>
	);
}

export default BartersPage;