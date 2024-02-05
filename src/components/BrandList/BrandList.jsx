import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useHelpers } from '../../hooks/useHelpers';
import { useUserProfile } from '../../UserProfileContext';

function BrandList({ setTotalProducts }) {
    const { user } = useTelegram();
    const { getPlural } = useHelpers();
    const { profile, loading } = useUserProfile();
    const [cards, setCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cardsData = await api.getCardsList(user?.id || profile.id);
                if (Array.isArray(cardsData)) {
                    setCards(cardsData);
                    const total = cardsData.length;
                    setTotalProducts(total);
                } else {
                    throw new Error('Произошла ошибка при получении списка брендов');
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchData();
    }, [user?.id, profile.id, setTotalProducts]);

    if (loading) {
        return <Preloader>Загружаюсь...</Preloader>;
    }

    if (errorMessage) {
        return <div className='error-message'>{errorMessage}</div>;
    }

    const brandsCount = Array.isArray(cards) ? cards.reduce((acc, card) => {
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
            {Object.entries(brandsCount).map(([brandName, { count }]) => (
                <div className='list-item' key={brandName}>
                    <span>{brandName}</span>
                    <small>{`${count} ${getPlural(count, 'товар', 'товара', 'товаров')}`}</small>
                </div>
            ))}
        </div>
    );
}

export default BrandList;