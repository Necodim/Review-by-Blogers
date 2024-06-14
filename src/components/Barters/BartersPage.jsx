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