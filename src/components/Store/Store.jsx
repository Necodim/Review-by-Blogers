import React, { useEffect, useState } from 'react'
import './Store.css'
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram'
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Preloader from '../Preloader/Preloader';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';

const Store = (props) => {
    const { profile, loading } = useUserProfile();

    const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
        placeholder: true,
        nmid: `id-${index}`,
    }));
    const [products, setProducts] = useState(initialProductsPlaceholder);
    const [productsIsLoading, setProductsIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const { showToast, resetLoadingToast } = useToastManager();

    const { user, showBackButton } = useTelegram();
    showBackButton();

    useEffect(() => {
        console.log(loading)
        const fetchData = async () => {
            try {
                const fetchedProducts = await api.getCardsList(profile.id);
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
        if (selectedProducts.length > 0) setIsPopupVisible(true);
    }


    const storeSeller = () => {
        return (
            <div className='content-wrapper'>
                <Header />
                <div className='container' id='products' >
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Мои товары</h2>
                            {products.length > 0 && <Button onClick={toggleEdit} className='link'>{isEditing ? 'Отменить' : 'Редактировать'}</Button>}
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
                {isEditing && <div className='edit-products-wrapper'><Button onClick={openPopupEditProducts} icon='edit'>Редактировать</Button></div>}
                {<Popup id='popup-edit-products' isOpen={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
                    <Button>Включить бартер</Button>
                    <Button>Выключить бартер</Button>
                    <Button>Написать ТЗ</Button>
                </Popup>}
            </div>
        )
    }

    const storeBloger = () => {
        return (
            <div>
                <Header />
                <span>
                    Категории
                </span>
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