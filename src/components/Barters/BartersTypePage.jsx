import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Barters.css';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useToastManager } from '../../hooks/useToast';
import Header from '../Header/Header';
import BartersNew from './Seller/BartersNew';
import BartersInProgress from './Seller/BartersInProgress';
import BartersCompleted from './Seller/BartersCompleted';

const BartersTypePage = () => {
  const { type } = useParams();
  const location = useLocation();
  const { barters } = location.state || [];
  const { isAvailable, showBackButton } = useTelegram();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [typeBartersIsLoading, setTypeBartersIsLoading] = useState(false);
  const [typeBarters, setTypeBarters] = useState([]);

  useEffect(() => {
    if (isAvailable) showBackButton();
  }, [isAvailable, showBackButton]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchBarters = async () => {
      setTypeBartersIsLoading(true);
      try {
        const response = await api.getBarterOffersByCurrentSeller(type);
        setTypeBarters(transformBarters(response));
        setTypeBartersIsLoading(false);
        console.log(response)
      } catch (error) {
        console.error(`Ошибка при получении бартеров с типом ${type}:`, error);
      }
    };
    if (barters.length > 0) {
      setTypeBarters(barters);
    } else {
      fetchBarters();
    }
  }, [barters]);

  const transformBarters = (barters) => {
    return barters
      .flatMap(barter => 
        barter.offers.map(offer => ({ ...barter, offer }))
      )
      .sort((a, b) => new Date(b.offer.updatedAt) - new Date(a.offer.updatedAt));
  };

  const getTypeComponent = (type, barters) => {
    switch (type) {
      case 'completed':
        return <BartersCompleted barters={barters} />
      case 'progress':
        return <BartersInProgress barters={barters} />
      case 'new':
      default:
        return <BartersNew barters={barters} />
    }
  }

  if (typeBartersIsLoading) {
    return (
      <div>Бартеры загружаются...</div>
    )
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {getTypeComponent(type, typeBarters)}
    </div>
  );
}

export default BartersTypePage;