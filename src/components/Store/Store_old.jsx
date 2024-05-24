import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './Store.css'
import api from '../../api/api';
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

const StoreSeller = (props) => {
    const { profile, loading } = useUserProfile();
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
    const [isPopupTaskWriteVisible, setIsPopupTaskWriteVisible] = useState(false);

    const { showToast } = useToastManager();

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setErrorMessage('');
        }
    }, [errorMessage, showToast]);

    useEffect(() => {
        if (location.state?.showPopupAfterBloggerOnboarding) {
            console.log("Показываем попап");
            console.log(location);
            setShowPopupAfterBloggerOnboarding(true);
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

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
          setSelectedProducts([]);
        }
      }

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) => {
            const prevSelectedNmids = prevSelected.map(product => product.nmid);
            prevSelectedNmids.includes(productId)
                ? prevSelectedNmids.filter((id) => id !== productId)
                : [...prevSelectedNmids, productId]
        });
    }
    const openPopupEditProducts = () => {
        if (selectedProducts.length > 0) setIsPopupEditProductsVisible(true);
    }

    const openPopupTaskWrite = () => {
        setIsPopupEditProductsVisible(false);
        setIsPopupTaskWriteVisible(true);
    }

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
                            isEditing ? (selectedProducts.map(product => product.nmid).includes(product.nmid) ? 'select' : 'unselect') : ''
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
                {isEditing && <Button onClick={openPopupEditProducts} className={isProductsChoosen ? 'sticky b-s shadow' : 'relative b-0 disabled'} icon='edit'>Редактировать</Button>}
            </div>
            {isEditing && <div className='edit-products-wrapper'><Button onClick={openPopupEditProducts} className={isProductsChoosen ? '' : 'disabled'} icon='edit'>Редактировать</Button></div>}
            {<Popup id='popup-edit-products' isOpen={isPopupEditProductsVisible} onClose={() => setIsPopupEditProductsVisible(false)}>
                <div className='list'>
                    <Button className='list-item vertical'>Включить бартер</Button>
                    <Button className='list-item vertical'>Выключить бартер</Button>
                    <Button className='list-item vertical' onClick={openPopupTaskWrite}>Написать ТЗ</Button>
                </div>
            </Popup>}
            {<Popup id='popup-write-task' isOpen={isPopupTaskWriteVisible} onClose={() => setIsPopupTaskWriteVisible(false)}>
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
                        comment='Укажите аккаунт бренда в instagram, если хотите, чтобы блогер вас отметил' 
                    />
                    <Input 
                        type='checkbox' 
                        id='feedback' 
                        name='feedback' 
                        title='Сбор отзывов' 
                        placeholder='Обязательно оставить отзыв' 
                        comment='Отметьте, если хотите, чтобы блогер оставил отзыв' 
                    />
                </Form>
                {/* <small>Укажите аккаунт бренда в instagram, если хотите, чтобы блогер вас отметил</small>
                <small>Отметьте, если хотите, чтобы блогер оставил отзыв</small> */}
            </Popup>}
        </div>
    )
}

export default StoreSeller;