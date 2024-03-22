import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useHelpers } from '../../hooks/useHelpers';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';

function BrandList({ setTotalProducts }) {
    const { showToast, resetLoadingToast } = useToastManager();
    const { getPlural } = useHelpers();
    const { profile, loading } = useUserProfile();
    const [products, setProducts] = useState([]);
    const [productsIsLoading, setProductsIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsData = await api.getProductsByUserId(profile.id);
                console.log(productsData)
                if (productsIsLoading && Array.isArray(productsData) && !!productsData.length) {
                    setProducts(productsData);
                    setTotalProducts(productsData.length);
                } else if (productsIsLoading && Array.isArray(productsData) && productsData.length === 0) {
                    setTotalProducts(productsData.length);
                    setErrorMessage('Товары не найдены');
                } else {
                    throw new Error('Произошла ошибка при получении списка брендов');
                }
            } catch (error) {
                setTotalProducts(0);
                console.log('error: ', error)
                if (error && error.response && error.response.data && error.response.data.code && error.response.data.code === 'API_KEY_MISSING') {
                    showToast('Вы не добавили API-ключ', 'warning');
                } else {
                    setErrorMessage(error.message);
                }
                if (!!errorMessage) {
                    showToast(errorMessage, 'error');
                }
            } finally {
                setProductsIsLoading(false);
            }
        };
        if (!loading) {
            fetchData();
        } else {
            return <Preloader>Загружаюсь...</Preloader>;
        }
    }, [loading, profile, setTotalProducts, errorMessage]);

    if (errorMessage) {
        return <div className='error-message'>{errorMessage}</div>;
    }

    const brandsCount = Array.isArray(products) ? products.reduce((acc, card) => {
        const { brand } = card;
        if (acc[brand]) {
            acc[brand].count += 1;
            acc[brand].items.push(card);
        } else {
            acc[brand] = { count: 1, items: [card] };
        }
        return acc;
    }, {}) : {};

    return (
        <div className='list'>
            {productsIsLoading ? (
                <div className='list-item'><p>Загрузка...</p></div>
            ) : (
                Object.entries(brandsCount).map(([brandName, { count }]) => (
                    <div className='list-item' key={brandName}>
                        <span>{brandName}</span>
                        <small>{`${count} ${getPlural(count, 'товар', 'товара', 'товаров')}`}</small>
                    </div>
                ))
            )}
        </div>
    );
}

export default BrandList;