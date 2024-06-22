import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import SearchBar from '../../SearchBar/SearchBar';
import Header from '../../Header/Header';
import PreloaderPage from '../../Preloader/PreloaderPage';
import Link from '../../Button/Link';
import BartersGrid from '../BartersGrid';

const SellerBartersPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();
  const { sortDatesByKey } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [isApi, setIsApi] = useState(false);
  const [barterOffers, setBarterOffers] = useState([]);
  const [offersIsLoading, setOffersIsLoading] = useState(true);
  const [queOffers, setQueOffers] = useState([]);
  const [newOffers, setNewOffers] = useState([]);
  const [progressOffers, setProgressOffers] = useState([]);
  const [completedOffers, setCompletedOffers] = useState([]);
  const [filteredBarterOffers, setFilteredBarterOffers] = useState(barterOffers);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    if (profile) {
      setIsApi(!!profile.api?.wildberries?.token);
    }
  }, [profile]);

  useEffect(() => {
    const fetchOffers = async () => {
      setOffersIsLoading(true);
      try {
        const offers = await api.getBarterOffersByCurrentSeller();
        setBarterOffers(offers);
        setOffersByStatus(offers);
        setFilteredBarterOffers(offers);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setOffersIsLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const setOffersByStatus = (offers) => {
    console.log(offers)
    const filterQueOffers = offers.filter(offer => ['queued'].includes(offer.status));
    const filterNewOffers = offers.filter(offer => ['created'].includes(offer.status));
    const filterProgressOffers = offers.filter(offer => ['sended', 'progress', 'planned', 'reported'].includes(offer.status));
    const filterCompletedOffers = offers.filter(offer => ['closed', 'refused'].includes(offer.status));
    setQueOffers(sortDatesByKey(filterQueOffers, 'updated_at'));
    setNewOffers(sortDatesByKey(filterNewOffers, 'updated_at'));
    setProgressOffers(sortDatesByKey(filterProgressOffers, 'updated_at'));
    setCompletedOffers(sortDatesByKey(filterCompletedOffers, 'updated_at'));
  }

  const goToBartersType = (type, offers) => {
    navigate(`/barters/type/${type}`, {state: { offers: offers }});
  }

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = barterOffers.filter(bo =>
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
    setOffersByStatus(filtered);
  };

  const createCards = (offers, type, title) => {
    if (offers.length > 0) {
      return (
        <div className='container' id={`offers-${type}`} >
          <div className='list'>
            <div className='list-item'>
              <h1>{title}</h1>
              <Link onClick={() => goToBartersType(type, offers)}>Ещё</Link>
            </div>
          </div>
          <BartersGrid offers={offers.slice(0, 2)} />
        </div>
      );
    } else {
      return;
    }
  }

  if (!isApi) {
    return <PreloaderPage title='Нет API' text='Вы не добавили API. Сначала добавьте API маркетплейса, после чего загрузятся ваши товары, и вы сможете создать бартеры. Отклики от блогеров появятся тут.' />
  } else if (offersIsLoading) {
    return <PreloaderPage text='Секундочку, загружаю ваши бартеры...' />
  } else if (!newOffers.length && !progressOffers.length && !completedOffers.length) {
    return <PreloaderPage title='Нужно подождать...' text='У вас пока нет предложений от блогеров.' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {barterOffers &&
        <div className='container' id='search'>
          <SearchBar onSearch={handleSearch} placeholder='Поиск бартеров...' />
        </div>
      }
      {createCards(newOffers, 'new', 'Новые')}
      {createCards(progressOffers, 'progress', 'В работе')}
      {/* {createCards(queOffers, 'que', 'В ожидании')} */}
      {createCards(completedOffers, 'completed', 'Завершённые')}
      {!filteredBarterOffers.length &&
        <PreloaderContainer title='Не найдено' text='Попробуйте изменить поисковый запрос.' />
      }
    </div>
  );
}

export default SellerBartersPage;