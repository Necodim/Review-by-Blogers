import React, { lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SelectedProductsProvider } from './hooks/useSelectProductsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReferral } from './hooks/useReferral';
import { useTelegram } from './hooks/useTelegram';
import { useUserProfile } from './hooks/UserProfileContext';
import Preloader from './components/Preloader/Preloader';

import Store from './components/Store/Store';
import BackButton from './hooks/useTelegramBackButton';

const StartScreen = lazy(() => import('./components/StartScreen/StartScreen'));
const WaitingForCapturePage = lazy(() => import('./pages/Subscription/WaitingForCapturePage'));

const Profile = lazy(() => import('./components/Profile/Profile'));
const Subscribe = lazy(() => import('./components/Profile/Subscription/Subscribe'));
const SetWbApi = lazy(() => import('./components/Profile/SetApi/SetWbApi'));

const BarterPage = lazy(() => import('./components/Barters/BarterPage'));

const BartersPage = lazy(() => import('./components/Barters/BartersPage'));

const CategoryPage = lazy(() => import('./components/Store/Blogger/CategoryPage'));
const ProductPage = lazy(() => import('./components/Store/ProductPage'));
const ProductsPage = lazy(() => import('./components/Store/ProductsPage'));
const BartersTypePage = lazy(() => import('./components/Barters/BartersType/BartersTypePage'));

const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));

const SupportPage = lazy(() => import('./pages/Info/SupportPage'));
const UserAgreementPage = lazy(() => import('./pages/Info/UserAgreementPage'));

function App() {
	const { setReferral } = useReferral();
	const { tg, defaultSettings } = useTelegram();
	const { profile, loading } = useUserProfile();
	const navigate = useNavigate();
	const location = useLocation();

	const [, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const params = {};
		for (let param of searchParams) {
			const [key, value] = param;
			params[key] = value;
		}

		if (params.ref) {
			setReferral(params.ref);
		}

		if (params.page) {
			navigate(decodeURIComponent(params.page));
		}
	}, []);

	useEffect(() => {
		const initialHeight = tg.viewportStableHeight;

		function handleResize() {
			const newHeight = tg.viewportHeight;
			const difference = initialHeight - newHeight;
			if (difference > 0) {
				setKeyboardHeight(difference);
				document.documentElement.style.setProperty('--keyboard-height', `${difference}px`);
			} else {
				setKeyboardHeight(0);
				document.documentElement.style.setProperty('--keyboard-height', `0px`);
			}
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (loading) return;
		if ((location.pathname !== '/' && location.pathname !== '/settings' && !location.pathname.startsWith('/info')) && (!profile || (profile.role !== 'seller' && profile.role !== 'blogger'))) {
			navigate('/');
		}
	}, [profile, navigate, location.pathname, loading]);

	useEffect(() => {
		if (tg) {
			// const { initDataRaw } = retrieveLaunchParams();
			// fetch('https://api.reviewbybloggers.ru/telegram/init', {
			// 	method: 'POST',
			// 	headers: {
			// 		Authorization: `tma ${initDataRaw}`
			// 	},
			// });
			tg.ready();
			defaultSettings();
		} else {
			console.log('Telegram Web App API недоступен.');
		}
	}, [tg, defaultSettings]);

	if (loading) {
		return <Preloader>Загружаюсь...</Preloader>;
	}

	return (
		<TonConnectUIProvider manifestUrl='https://reviewbybloggers.ru/tonconnect-manifest.json'>
			<div className="app">
				<BackButton />
				<Routes>
					<Route index element={!profile || !profile.role ? <StartScreen /> : <Navigate to="/profile" replace />} />

					<Route path="/profile" element={<Profile />} />
					<Route path="/profile/subscribe" element={<Subscribe />} />
					<Route path="/profile/subscribe/waiting-for-capture" element={<WaitingForCapturePage />} />
					<Route path="/profile/api" element={<SetWbApi />} />

					<Route path="/store" element={<SelectedProductsProvider><Store /></SelectedProductsProvider>} />
					<Route path="/store/categories/:subCategoryId"
						element={<SelectedProductsProvider><CategoryPage /></SelectedProductsProvider>} />
					<Route path="/store/products/:productId" element={<ProductPage />} />
					<Route path="/store/products"
						element={<SelectedProductsProvider><ProductsPage /></SelectedProductsProvider>} />

					<Route path="/barters" element={<BartersPage />} />
					<Route path="/barters/type/:type" element={<BartersTypePage />} />

					<Route path="/barters/:barterId/:offerId" element={<BarterPage />} />
					<Route path="/barters/new/:productId" element={<BartersPage />} />

					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/info/support" element={<SupportPage />} />
					<Route path="/info/user-agreement" element={<UserAgreementPage />} />
				</Routes>
				<ToastContainer />
			</div>
		</TonConnectUIProvider>
	);
}

export default App;
