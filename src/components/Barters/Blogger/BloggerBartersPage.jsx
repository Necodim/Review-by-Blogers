import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useTelegram } from '../../../hooks/useTelegram';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import BartersGrid from '../BartersGrid';
import Preloader from '../../Preloader/Preloader';
// import BartersHistoryTable from '../BartersHistoryTable';

const BloggerBartersPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { isAvailable, showBackButton } = useTelegram();
  const { showToast } = useToastManager();

	useEffect(() => {
		if (isAvailable) showBackButton();
	}, [isAvailable, showBackButton]);

  const [errorMessage, setErrorMessage] = useState('');
  const [barters, setBarterOffers] = useState([]);
  const [bartersIsLoading, setBartersIsLoading] = useState(true);
  const [newBarters, setNewBarters] = useState([]);
  const [inProgressBarters, setInProgressBarters] = useState([]);
  const [completedBarters, setCompletedBarters] = useState([]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchBartersCurrent = async () => {
      setBartersIsLoading(true);
      try {
        // const fetchedBarters = await api.getBarterOffersByCurrentBlogger(10, 0);
        // console.log('fetchedBarters', fetchedBarters)
        // if (bartersIsLoading && Array.isArray(fetchedBarters) && !!fetchedBarters.length) {
        //   setBarterOffers(fetchedBarters);
        // } else {
        //   throw new Error('Произошла ошибка при получении списка бартеров');
        // }
        const response = await api.getBarterOffersByCurrentSeller();
        const { newBarters, inProgressBarters, completedBarters } = response;
        setNewBarters(transformBarters(newBarters));
        setInProgressBarters(transformBarters(inProgressBarters));
        setCompletedBarters(transformBarters(completedBarters));
        setBartersIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setBartersIsLoading(false);
      }
    }
    fetchBartersCurrent();
  }, [profile]);

  const transformBarters = (barters) => {
    return barters
      .flatMap(barter => 
        barter.offers.map(offer => ({ ...barter, offer }))
      )
      .sort((a, b) => new Date(b.offer.updatedAt) - new Date(a.offer.updatedAt));
  };

  const goToBartersType = (type, barters) => {
    navigate(`/barters/type/${type}`, {state: { barters: barters }});
  }

  const createCards = (barters, type, title) => {
    if (barters.length > 0) {
      return (
        <div className='container' id={`barters-${type}`} >
          <div className='list'>
            <div className='list-item'>
              <h2>{title}</h2>
              <Link onClick={() => goToBartersType(type, barters)}>Ещё</Link>
            </div>
          </div>
          <BartersGrid barters={barters.slice(0, 2)} />
        </div>
      );
    } else {
      return;
    }
  }

  if (bartersIsLoading) {
    return <Preloader>Загружаюсь...</Preloader>;
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {createCards(inProgressBarters, 'progress', 'В работе')}
      {createCards(newBarters, 'new', 'На рассмотрении')}
      {createCards(completedBarters, 'completed', 'Завершённые')}
      {/* <BartersHistoryTable /> */}
    </div>
  );
}

export default BloggerBartersPage;