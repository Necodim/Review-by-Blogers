import React, { useEffect, useState } from 'react';
import '../Barters.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import BartersHistoryTable from '../BartersHistoryTable';

const SellerBartersPage = () => {
  const { profile, loading } = useUserProfile();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [barters, setBarters] = useState([]);
  const [bartersIsLoading, setBartersIsLoading] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  const navigate = useNavigate();

  const openBarter = (id) => {
    navigate(`${id}`);
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='barter-new' >
        <div className='list'>
          <div className='list-item'>
            <h2>Новые заявки</h2>
            <Link onClick={() => { }}>Ещё</Link>
          </div>
        </div>
        <div className='cards'>
          {bartersNew.map((barter, index) => (
            <div
              key={barter.id}
              className='card product-card'
              onClick={() => { openBarter(barter.id) }}
              data-barter-id={barter.id}
            >
              <div
                className={`product-image ${barter.product?.photos && barter.product?.photos.length > 0 ? '' : bartersNewIsLoading || barter.placeholder ? 'loading' : 'default'}`}
                style={{ backgroundImage: barter.product?.photos && barter.product?.photos.length > 0 ? `url(${barter.product?.photos[0]})` : '' }}
              ></div>
              <div className='product-content'>
                {barter.placeholder ? (<span className='product-title'>Загрузка...</span>) : (<span className='product-title'>{barter.product?.title}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='container' id='barter-current' >
        <div className='list'>
          <div className='list-item'>
            <h2>В работе</h2>
            <Link onClick={() => { }}>Ещё</Link>
          </div>
        </div>
        <div className='cards'>
          {bartersCurrent.map((barter, index) => (
            <div
              key={barter.id}
              className='card product-card'
              onClick={() => { openBarter(barter.id) }}
              data-barter-id={barter.id}
            >
              <div
                className={`product-image ${barter.product?.photos && barter.product?.photos.length > 0 ? '' : bartersCurrentIsLoading || barter.placeholder ? 'loading' : 'default'}`}
                style={{ backgroundImage: barter.product?.photos && barter.product?.photos.length > 0 ? `url(${barter.product?.photos[0]})` : '' }}
              ></div>
              <div className='product-content'>
                {barter.placeholder ? (<span className='product-title'>Загрузка...</span>) : (<span className='product-title'>{barter.product?.title}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <BartersHistoryTable /> */}
    </div>
  );
}

export default SellerBartersPage;