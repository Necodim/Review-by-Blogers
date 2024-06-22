import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../Barters.css';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import PreloaderPage from '../../Preloader/PreloaderPage';
import PreloaderContainer from '../../Preloader/PreloaderContainer';
import Header from '../../Header/Header';
import SearchBar from '../../SearchBar/SearchBar';
import BartersNew from './BartersNew';
import BartersProgress from './BartersProgress';
import BartersCompleted from './BartersCompleted';
import BartersQue from './BartersQue';

const BartersTypePage = () => {
  const { type } = useParams();
  const location = useLocation();
  const { offers } = location.state || [];
  const { showToast } = useToastManager();
  const { sortDatesByKey } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [typeOffersIsLoading, setTypeOffersIsLoading] = useState(false);
  const [typeOffers, setTypeOffers] = useState([]);
  const [filteredBarterOffers, setFilteredBarterOffers] = useState(offers);

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
        const sortedOffers = sortDatesByKey(response, 'updated_at');
        setTypeOffers(sortedOffers);
        setFilteredBarterOffers(sortedOffers);
      } catch (error) {
        console.error(`Ошибка при получении бартеров с типом ${type}:`, error);
      } finally {
        setTypeOffersIsLoading(false);
      }
    };
    if (offers.length > 0) {
      setTypeOffers(offers);
      setFilteredBarterOffers(offers);
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

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = offers.filter(bo =>
      bo.product?.nmid?.toString().includes(lowerCaseQuery) ||
      bo.product?.subjectname?.toLowerCase().includes(lowerCaseQuery) ||
      bo.product?.vendorcode?.toLowerCase().includes(lowerCaseQuery) ||
      bo.product?.brand?.toLowerCase().includes(lowerCaseQuery) ||
      bo.product?.title?.toLowerCase().includes(lowerCaseQuery) ||
      bo.blogger?.firstname?.toLowerCase().includes(lowerCaseQuery) ||
      bo.blogger?.lastname?.toLowerCase().includes(lowerCaseQuery) ||
      bo.blogger?.instagram_username?.toLowerCase().includes(lowerCaseQuery) ||
      bo.blogger?.username?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredBarterOffers(filtered);
    setTypeOffers(filtered);
  };

  if (typeOffersIsLoading) {
    return <PreloaderPage text='Предложения загружаются...' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {offers &&
        <div className='container' id='search'>
          <SearchBar onSearch={handleSearch} placeholder='Поиск бартеров...' />
        </div>
      }
      {getTypeComponent(type, typeOffers)}
      {!filteredBarterOffers.length &&
        <PreloaderContainer title='Не найдено' text='Попробуйте изменить поисковый запрос.' />
      }
    </div>
  );
}

export default BartersTypePage;