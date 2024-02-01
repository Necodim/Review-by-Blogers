// src/components/BrandList.js
import React, { useEffect, useState } from 'react';
import getCardsList from '../../api/api';
import { getProfile } from '../../hooks/getProfile';

function BrandList() {
    const { api } = getProfile();
    const [cards, setCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cardsData = await getCardsList(api);
                setCards(cardsData);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchData();
    }, [api]);

    if (errorMessage) {
        return <div className='error-message'>{errorMessage}</div>;
    }

    // Группируем карточки по бренду и подсчитываем количество
    const brandsCount = cards.reduce((acc, card) => {
        const { brand } = card;
        if (acc[brand]) {
            acc[brand].count += 1;
            acc[brand].items.push(card);
        } else {
            acc[brand] = { count: 1, items: [card] };
        }
        return acc;
    }, {});

    return (
        <div className='list'>
            {Object.entries(brandsCount).map(([brandName, { count }]) => (
                <div className='list-item' key={brandName}>
                    <span>{brandName}</span>
                    <small>{count + ' товаров'}</small>
                </div>
            ))}
        </div>
    );
}

export default BrandList;
