// src/components/BrandList.js
import React, { useEffect, useState } from 'react';
import getCardsList from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram'

function BrandList() {
    const {user} = useTelegram();
    const [cards, setCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cardsData = await getCardsList(user?.id);
                setCards(cardsData);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        fetchData();
    }, [user?.id]);

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
