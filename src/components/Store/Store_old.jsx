import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './Store.css'
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram'
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Preloader from '../Preloader/Preloader';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import Popup from '../Popup/Popup';
import Form from '../Form/Form';
import Textarea from '../Form/Textarea';
import Input from '../Form/Input';
import CategoryCard from './CategoryCard';

const Store = (props) => {
    const { profile, loading } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();

    const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
        placeholder: true,
        nmid: `id-${index}`,
    }));
    const [products, setProducts] = useState(initialProductsPlaceholder);
    const [productsIsLoading, setProductsIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isProductsChoosen, setIsProductsChoosen] = useState(false);
    const [isPopupEditProductsVisible, setIsPopupEditProductsVisible] = useState(false);
    const [isPopupWriteTaskVisible, setIsPopupWriteTaskVisible] = useState(false);
    const [showPopupAfterBlogerOnboarding, setShowPopupAfterBlogerOnboarding] = useState(false);

    const { showToast, resetLoadingToast } = useToastManager();

    const { user, showBackButton } = useTelegram();
    showBackButton();

    useEffect(() => {
        if (location.state?.showPopupAfterBlogerOnboarding) {
            console.log("Показываем попап");
            console.log(location);
            setShowPopupAfterBlogerOnboarding(true);
        }
    }, [location.state]);

    useEffect(() => {
        setIsProductsChoosen(selectedProducts.length > 0);
    }, [selectedProducts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProducts = await api.getProductsByUserId(profile.id);
                if (productsIsLoading && Array.isArray(fetchedProducts) && !!fetchedProducts.length) {
                    setProducts(fetchedProducts);
                } else {
                    throw new Error('Произошла ошибка при получении списка товаров');
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setProductsIsLoading(false);
            }
        }
        if (!loading) {
            fetchData();
        } else {
            return <Preloader>Загружаюсь...</Preloader>;
        }
    }, [loading, profile]);

    if (errorMessage) {
        return showToast(errorMessage, 'error');
        // return <div className='error-message'>{errorMessage}</div>;
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
          setSelectedProducts([]);
        }
      }
      
    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    }
    const openPopupEditProducts = () => {
        if (selectedProducts.length > 0) setIsPopupEditProductsVisible(true);
    }

    const openPopupWriteTask = () => {
        setIsPopupEditProductsVisible(false);
        setIsPopupWriteTaskVisible(true);
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

    const storeSeller = () => {
        return (
            <div className='content-wrapper'>
                <Header />
                <div className='container' id='products'>
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Мои товары</h2>
                            {products.length > 0 && <Link onClick={toggleEdit}>{isEditing ? 'Отменить' : 'Редактировать'}</Link>}
                        </div>
                    </div>
                    <div className='cards'>
                        {products.map((product, index) => (
                            <div
                                key={product.nmid}
                                className={`card product-card ${
                                isEditing ? (selectedProducts.includes(product.nmid) ? 'select' : 'unselect') : ''
                                }`}
                                onClick={() => isEditing && handleSelectProduct(product.nmid)}
                                data-product-id={product.nmid}
                                data-product-brand={product.brand}
                            >
                                <div className={'status' + (product.barter ? 'active' : '')} />
                                <div className='selection-point' />
                                <div
                                    className={`product-image ${product.photos && product.photos.length > 0 ? '' : productsIsLoading || product.placeholder ? 'loading' : 'default'}`}
                                    style={{ backgroundImage: product.photos && product.photos.length > 0 ? `url(${product.photos[0]})` : '' }}
                                ></div>
                                <div className='product-content'>
                                    {product.placeholder ? (
                                        <span className='product-title'>Загрузка...</span>
                                    ) : (
                                        <span className='product-title'>{product.title}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {isEditing && <div className='edit-products-wrapper'><Button onClick={openPopupEditProducts} className={isProductsChoosen ? '' : 'disabled'} icon='edit'>Редактировать</Button></div>}
                {<Popup id='popup-edit-products' isOpen={isPopupEditProductsVisible} onClose={() => setIsPopupEditProductsVisible(false)}>
                    <div className='list'>
                        <Button className='list-item vertical'>Включить бартер</Button>
                        <Button className='list-item vertical'>Выключить бартер</Button>
                        <Button className='list-item vertical' onClick={openPopupWriteTask}>Написать ТЗ</Button>
                    </div>
                </Popup>}
                {<Popup id='popup-write-task' isOpen={isPopupWriteTaskVisible} onClose={() => setIsPopupWriteTaskVisible(false)}>
                    <h2>Техническое задание</h2>
                    <Form onSubmit={() => {}} btntext='Сохранить' btnicon='save'>
                        <Textarea 
                            id='task' 
                            name='task' 
                            title='Техническое задание' 
                            placeholder='Необходимо распаковать товар на камеру и...' 
                        />
                        <Input 
                            id='brand-instagram' 
                            name='brand-instagram' 
                            title='Instagram профиль бренда' 
                            placeholder='username' 
                        />
                        <Input 
                            type='checkbox' 
                            id='feedback' 
                            name='feedback' 
                            title='Сбор отзывов' 
                            placeholder='Обязательно оставить отзыв' 
                        />
                    </Form>
                    <small>Отметьте, если хотите, чтобы блогер оставил отзыв</small>
                    <small>Укажите аккаунт бренда в instagram, если хотите, чтобы блогер вас отметил</small>
                </Popup>}
            </div>
        )
    }

    const storeBloger = () => {
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

    if (profile.role === 'seller') {
        return storeSeller();
    } else if (profile.role === 'bloger') {
        return storeBloger();
    }
}

export default Store;