import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import BartersGrid from '../BartersGrid';
// import BartersHistoryTable from '../BartersHistoryTable';

const BloggerBartersPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [barters, setBarterOffers] = useState([]);
  const [bartersIsLoading, setBarterOffersIsLoading] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchBartersCurrent = async () => {
      setBarterOffersIsLoading(true);
      try {
        const fetchedBarters = await api.getBarterOffersByCurrentUser(10, 0);
        console.log('fetchedBarters', fetchedBarters)
        if (bartersIsLoading && Array.isArray(fetchedBarters) && !!fetchedBarters.length) {
          setBarterOffers(fetchedBarters);
        } else {
          throw new Error('Произошла ошибка при получении списка бартеров');
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setBarterOffersIsLoading(false);
      }
    }
    fetchBartersCurrent();
  }, [profile])

  const openBartersPage = () => {
    navigate('/barters/progress', { state: { barters: barters, title: 'В работе' } });
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='barters' >
        <div className='list'>
          <div className='list-item'>
            <h2>В работе</h2>
            <Link onClick={openBartersPage}>Ещё</Link>
          </div>
        </div>
        <BartersGrid
          barters={barters.slice(0, 4)}
        />
      </div>
      {/* <BartersHistoryTable /> */}
    </div>
  );
}

export default BloggerBartersPage;