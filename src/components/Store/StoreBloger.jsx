import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './Store.css'
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Header from '../Header/Header';
import Popup from '../Popup/Popup';
import CategoryCard from './CategoryCard';

const StoreBloger = (props) => {
    const { profile } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();

    const [errorMessage, setErrorMessage] = useState('');
    const [showPopupAfterBlogerOnboarding, setShowPopupAfterBlogerOnboarding] = useState(false);

    const { showToast, resetLoadingToast } = useToastManager();

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

    const openCategory = (e) => {
        if (e.target.hasAttribute('data-category') && e.target.hasAttribute('data-parent-category')) {
            const categoryId = e.target.dataset.category;
            navigate(categoryId);
        } else if (e.target.hasAttribute('data-category') && !e.target.hasAttribute('data-parent-category')) {
            const categoryId = e.target.dataset.category;
            const subCategories = document.querySelectorAll(`[data-parent-category="${categoryId}"]`);
            console.log(subCategories)
            if (subCategories.length > 0) {
                if (e.target.classList.contains('opened')) {
                    e.target.classList.remove('opened');
                    subCategories.forEach(sub => sub.classList.add('closed'));
                } else {
                    e.target.classList.add('opened');
                    subCategories.forEach(sub => sub.classList.remove('closed'));
                }
            } else {
                navigate(categoryId);
            }
        }
    }

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='categories-wrapper' id='categories'>
                <div className='list'>
                    <CategoryCard onClick={openCategory} className='list-item' title='Категория 1' count='5' data-category='100' />
                    <CategoryCard onClick={openCategory} className='list-item' title='Категория 2' count='14' data-category='200' />
                    <CategoryCard onClick={openCategory} className='sub list-item closed' title='Подкатегория 1' count='7' data-category='201' data-parent-category='200' />
                    <CategoryCard onClick={openCategory} className='sub list-item closed' title='Подкатегория 2' count='4' data-category='202' data-parent-category='200' />
                    <CategoryCard onClick={openCategory} className='sub list-item closed' title='Подкатегория 3' count='3' data-category='203' data-parent-category='200' />
                    <CategoryCard onClick={openCategory} className='list-item' title='Категория 3' count='25' data-category='300' />
                </div>
            </div>
            <Popup id='popup-after-bloger-onboarding' isOpen={showPopupAfterBlogerOnboarding} onClose={() => setShowPopupAfterBlogerOnboarding(false)}>
                Теперь вы&nbsp;можете выбрать товар в&nbsp;одной из&nbsp;этих категорий и&nbsp;отправить селлеру заявку на&nbsp;рекламу по&nbsp;бартеру.
            </Popup>
        </div>
    )
}

export default StoreBloger;