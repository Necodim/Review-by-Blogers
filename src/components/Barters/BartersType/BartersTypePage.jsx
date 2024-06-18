import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../Barters.css';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import Header from '../../Header/Header';
import BartersNew from './BartersNew';
import BartersProgress from './BartersProgress';
import BartersCompleted from './BartersCompleted';
import BartersQue from './BartersQue';
import PreloaderPage from '../../Preloader/PreloaderPage';

const BartersTypePage = () => {
  const { type } = useParams();
  const location = useLocation();
  const { offers } = location.state || [];
  const { showToast } = useToastManager();
  const { sortBy } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [typeOffersIsLoading, setTypeOffersIsLoading] = useState(false);
  const [typeOffers, setTypeOffers] = useState([]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchOffers = async () => {
      setTypeOffersIsLoading(true);
      try {
        const response = await api.getBarterOffersByCurrentSeller(type);
        setTypeOffers(sortBy(response, 'updated_at'));
        setTypeOffersIsLoading(false);
        console.log(response)
      } catch (error) {
        console.error(`Ошибка при получении бартеров с типом ${type}:`, error);
      }
    };
    if (offers.length > 0) {
      setTypeOffers(offers);
    } else {
      fetchOffers();
    }
  }, [offers]);

  const getTypeComponent = (type, offers) => {
    switch (type) {
      case 'que':
        return <BartersQue offers={offers} />
      case 'completed':
        return <BartersCompleted offers={offers} />
      case 'progress':
        return <BartersProgress offers={offers} />
      case 'new':
      default:
        return <BartersNew offers={offers} />
    }
  }

  if (typeOffersIsLoading) {
    return <PreloaderPage text='Предложения загружаются...' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {getTypeComponent(type, typeOffers)}
    </div>
  );
}

export default BartersTypePage;