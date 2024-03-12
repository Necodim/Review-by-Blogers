import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './Store.css'
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Header from '../Header/Header';
import Popup from '../Popup/Popup';
import Categories from './Categories';
import CategoryCard from './CategoryCard';

const StoreBloger = (props) => {
    const { profile } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast, resetLoadingToast } = useToastManager();

    const [errorMessage, setErrorMessage] = useState('');
    const [showPopupAfterBlogerOnboarding, setShowPopupAfterBlogerOnboarding] = useState(false);

    useEffect(() => {
        if (location.state?.showPopupAfterBlogerOnboarding) {
            console.log("Показываем попап");
            console.log(location);
            setShowPopupAfterBlogerOnboarding(true);
        }
    }, [location.state]);

    if (errorMessage) {
        return showToast(errorMessage, 'error');
        // return <div className='error-message'>{errorMessage}</div>;
    }

    const handleCategorySelect = (categoryId) => {
        navigate(`/${profile.role}/store/${categoryId}`);
    };

    return (
        <div className='content-wrapper'>
            <Header />
            <Categories onCategorySelect={handleCategorySelect} />
            <Popup id='popup-after-bloger-onboarding' isOpen={showPopupAfterBlogerOnboarding} onClose={() => setShowPopupAfterBlogerOnboarding(false)}>
                Теперь вы&nbsp;можете выбрать товар в&nbsp;одной из&nbsp;этих категорий и&nbsp;отправить селлеру заявку на&nbsp;рекламу по&nbsp;бартеру.
            </Popup>
        </div>
    )
}

export default StoreBloger;