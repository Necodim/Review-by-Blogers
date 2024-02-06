import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useHelpers } from '../../hooks/useHelpers';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';

function BrandList({ setTotalProducts }) {
    const { user } = useTelegram();
    const { showToast, resetLoadingToast } = useToastManager();
    const { getPlural } = useHelpers();
    const { profile, loading } = useUserProfile();
    const [products, setProducts] = useState([]);
    const [productsIsLoading, setProductsIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsData = await api.getCardsList(profile.id);
                if (productsIsLoading && Array.isArray(productsData) && !!productsData.length) {
                    setProducts(productsData);
                    const total = productsData.length;
                    setTotalProducts(total);
                } else {
                    throw new Error('Произошла ошибка при получении списка брендов');
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setProductsIsLoading(false);
            }
        };
        if (!loading) {
            fetchData();
        } else {
            return <Preloader>Загружаюсь...</Preloader>;
        }
    }, [loading, profile, setTotalProducts]);

    if (errorMessage) {
        return showToast(errorMessage, 'error');
        // return <div className='error-message'>{errorMessage}</div>;
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