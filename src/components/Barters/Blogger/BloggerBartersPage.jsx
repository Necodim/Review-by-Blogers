import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useTelegram } from '../../../hooks/useTelegram';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import BartersGrid from '../BartersGrid';
import Preloader from '../../Preloader/Preloader';
import PreloaderContainer from '../../Preloader/PreloaderContainer';
// import BartersHistoryTable from '../BartersHistoryTable';

const BloggerBartersPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { isAvailable, showBackButton } = useTelegram();
  const { showToast } = useToastManager();
  const { sortBy } = useHelpers();

	useEffect(() => {
		if (isAvailable) showBackButton();
	}, [isAvailable, showBackButton]);

  const [errorMessage, setErrorMessage] = useState('');
  const [barterOffers, setBarterOffers] = useState([]);
  const [offersIsLoading, setOffersIsLoading] = useState(true);
  const [queOffers, setQueOffers] = useState([]);
  const [newOffers, setNewOffers] = useState([]);
  const [progressOffers, setProgressOffers] = useState([]);
  const [completedOffers, setCompletedOffers] = useState([]);

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
        const responseQueOffers = offers.filter(offer => ['queued'].includes(offer.status));
        const responseNewOffers = offers.filter(offer => ['created'].includes(offer.status));
        const responseProgressOffers = offers.filter(offer => ['sended', 'progress', 'planned', 'reported'].includes(offer.status));
        const responseCompletedOffers = offers.filter(offer => ['closed', 'refused'].includes(offer.status));
        setQueOffers(sortBy(responseQueOffers, 'updated_at'));
        setNewOffers(sortBy(responseNewOffers, 'updated_at'));
        setProgressOffers(sortBy(responseProgressOffers, 'updated_at'));
        setCompletedOffers(sortBy(responseCompletedOffers, 'updated_at'));
        setOffersIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setOffersIsLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const goToBartersType = (type, offers) => {
    navigate(`/barters/type/${type}`, {state: { barters: offers }});
  }

  const createCards = (offers, type, title) => {
    if (offers.length > 0) {
      return (
        <div className='container' id={`offers-${type}`} >
          <div className='list'>
            <div className='list-item'>
              <h2>{title}</h2>
              <Link onClick={() => goToBartersType(type, offers)}>Ещё</Link>
            </div>
            {type === 'que' &&
              <div className='list-item'>
                <small>Завершите работу по другим бартерам, чтобы приступить к этим</small>
              </div>
            }
          </div>
          <BartersGrid barters={offers.slice(0, 2)} />
        </div>
      );
    } else {
      return;
    }
  }

  if (offersIsLoading) {
    return <PreloaderContainer text='Секундочку, загружаю ваши бартеры...' />
  } else if (queOffers.length === 0 && newOffers.length === 0 && progressOffers.length === 0 && completedOffers.length === 0) {
    return <PreloaderContainer title='Нужно подождать...' text='У вас пока нет предложений от блогеров.' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {createCards(progressOffers, 'progress', 'В работе')}
      {createCards(newOffers, 'new', 'Новые')}
      {createCards(queOffers, 'que', 'В ожидании')}
      {createCards(completedOffers, 'completed', 'Завершённые')}
    </div>
  );
}

export default BloggerBartersPage;