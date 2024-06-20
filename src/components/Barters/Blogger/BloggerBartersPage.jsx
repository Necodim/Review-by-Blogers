import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import PreloaderPage from '../../Preloader/PreloaderPage';
import PreloaderContainer from '../../Preloader/PreloaderContainer';
import Header from '../../Header/Header';
import SearchBar from '../../SearchBar/SearchBar';
import Link from '../../Button/Link';
import BartersGrid from '../BartersGrid';
// import BartersHistoryTable from '../BartersHistoryTable';

const BloggerBartersPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();
  const { sortBy } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
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
    const fetchOffers = async () => {
      setOffersIsLoading(true);
      try {
        const offers = await api.getBarterOffersByCurrentBlogger();
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
    const filterQueOffers = offers.filter(offer => ['queued'].includes(offer.status));
    const filterNewOffers = offers.filter(offer => ['created'].includes(offer.status));
    const filterProgressOffers = offers.filter(offer => ['sended', 'progress', 'planned', 'reported'].includes(offer.status));
    const filterCompletedOffers = offers.filter(offer => ['closed', 'refused'].includes(offer.status));
    setQueOffers(sortBy(filterQueOffers, 'updated_at'));
    setNewOffers(sortBy(filterNewOffers, 'updated_at'));
    setProgressOffers(sortBy(filterProgressOffers, 'updated_at'));
    setCompletedOffers(sortBy(filterCompletedOffers, 'updated_at'));
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
      bo.seller?.firstname?.toLowerCase().includes(lowerCaseQuery) ||
      bo.seller?.lastname?.toLowerCase().includes(lowerCaseQuery) ||
      bo.seller?.username?.toLowerCase().includes(lowerCaseQuery)
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
            {type === 'que' &&
              <div className='list-item'>
                <small>Завершите работу по другим бартерам, чтобы приступить к этим</small>
              </div>
            }
          </div>
          <BartersGrid offers={offers.slice(0, 2)} />
        </div>
      );
    } else {
      return;
    }
  }

  if (offersIsLoading) {
    return <PreloaderPage text='Секундочку, загружаю ваши бартеры...' />
  } else if (!queOffers && !newOffers && !progressOffers && !completedOffers) {
    return <PreloaderPage title='Бартеров нет' text='Вы ещё не отправляли предложения о сотрудничестве селлерам. Перейдите в каталог и выберите подходящий товар.' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {barterOffers &&
        <div className='container' id='search'>
          <SearchBar onSearch={handleSearch} placeholder='Поиск бартеров...' />
        </div>
      }
      {createCards(progressOffers, 'progress', 'В работе')}
      {createCards(newOffers, 'new', 'Новые')}
      {createCards(queOffers, 'que', 'В ожидании')}
      {createCards(completedOffers, 'completed', 'Завершённые')}
      {!filteredBarterOffers.length &&
        <PreloaderContainer title='Не найдено' text='Попробуйте изменить поисковый запрос.' />
      }
    </div>
  );
}

export default BloggerBartersPage;