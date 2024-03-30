import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Store.css';
import { useTelegram } from '../../hooks/useTelegram';
import { useToastManager } from '../../hooks/useToast';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import ProductsGrid from './ProductsGrid';
import PopupEditProducts from './PopupEditProducts';
import PopupWriteTask from './PopupWriteTask';

const ProductsActivePage = () => {
    const { isAvailable, showBackButton } = useTelegram();
    const location = useLocation();
    const { showToast } = useToastManager();
    
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPopupEditProductsVisible, setIsPopupEditProductsVisible] = useState(false);
    const [isPopupWriteTaskVisible, setIsPopupWriteTaskVisible] = useState(false);

    useEffect(() => {
        if (isAvailable) showBackButton();
    }, [isAvailable, showBackButton]);

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setErrorMessage('');
        }
    }, [errorMessage, showToast]);

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

    const { products } = location.state || { products: [] };

    return (
        <div className='content-wrapper'>
            <Header />
            <div className='container' id='products'>
                <div className='list'>
                    <div className='list-item'>
                        <h2>В&nbsp;работе</h2>
                        {products.length > 0 && <Link onClick={toggleEdit}>{isEditing ? 'Отменить' : 'Редактировать'}</Link>}
                    </div>
                </div>
                <ProductsGrid
                    products={products}
                    isEditing={isEditing}
                    selectedProducts={selectedProducts}
                    handleSelectProduct={handleSelectProduct}
                />
                {isEditing && <Button onClick={openPopupEditProducts} className={selectedProducts.length > 0 ? 'sticky b-s shadow' : 'relative b-0 disabled'} icon='edit'>Редактировать</Button>}
            </div>
            <PopupEditProducts
                isOpen={isPopupEditProductsVisible}
                onClose={() => setIsPopupEditProductsVisible(false)}
                onWriteTask={openPopupWriteTask}
            />
            <PopupWriteTask
                isOpen={isPopupWriteTaskVisible}
                onClose={() => setIsPopupWriteTaskVisible(false)}
            />
        </div>
    );
};

export default ProductsActivePage;