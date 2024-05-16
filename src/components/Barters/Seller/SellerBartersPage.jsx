import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useTelegram } from '../../../hooks/useTelegram';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import BartersHistoryTable from '../BartersHistoryTable';
import BartersGrid from '../BartersGrid';

const SellerBartersPage = () => {
  const navigate = useNavigate();
  const { isAvailable, showBackButton } = useTelegram();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [bartersIsLoading, setBartersIsLoading] = useState(true);
  const [newBarters, setNewBarters] = useState([]);
  const [inProgressBarters, setInProgressBarters] = useState([]);
  const [completedBarters, setCompletedBarters] = useState([]);

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
      setBartersIsLoading(true);
      try {
        const response = await api.getBarterOffersByCurrentSeller();
        const { newBarters, inProgressBarters, completedBarters } = response;
        setNewBarters(transformBarters(newBarters));
        setInProgressBarters(transformBarters(inProgressBarters));
        setCompletedBarters(transformBarters(completedBarters));
        setBartersIsLoading(false);
      } catch (error) {
        console.error('Ошибка при получении бартеров:', error);
      }
    };
    fetchBarters();
  }, []);

  const transformBarters = (barters) => {
    return barters
      .flatMap(barter => 
        barter.offers.map(offer => ({ ...barter, offer }))
      )
      .sort((a, b) => new Date(b.offer.updatedAt) - new Date(a.offer.updatedAt));
  };

  const openBarter = (barter) => {
    navigate(`${barter.id}`, {state: { barter: barter }});
  }

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

  return (
    <div className='content-wrapper'>
      <Header />
      {createCards(newBarters, 'new', 'Новые предложения')}
      {createCards(inProgressBarters, 'progress', 'В работе')}
      {createCards(completedBarters, 'completed', 'Завершённые')}
      {/* <BartersHistoryTable /> */}
    </div>
  );
}

export default SellerBartersPage;