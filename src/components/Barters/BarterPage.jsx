import React, { useEffect, useState } from 'react';
import './Barters.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import { useHelpers } from '../../hooks/useHelpers';
import Header from '../Header/Header';
import Input from '../Form/Input';
import Button from '../Button/Button';
import BarterStatus from './BrterStatus/BarterStatus';

const BarterPage = () => {
  const { barter } = location.state || {};
  const { barterId } = useParams();
  const { showToast } = useToastManager();
  const navigate = useNavigate();
  const { copyToClipboard, getMarketplaceShortName, getMarketplaceProductLink } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [currentBarter, setCurrentBarter] = useState(barter);
  const [barterIsLoading, setBarterIsLoading] = useState(false);
  const [productLink, setProductLink] = useState('');
  const [marketplaceShortName, setMarketplaceShortName] = useState('');

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchBarter = async () => {
      setBarterIsLoading(true);
      try {
        const fetchedBarter = await api.getBarterById(barterId);
        console.log('fetchedBarter', fetchedBarter)
        if (fetchedBarter) {
          setCurrentBarter(fetchedBarter);
          const short = await getMarketplaceShortName(fetchedBarter?.product?.marketplace_id);
          const link = await getMarketplaceProductLink(fetchedBarter?.product?.marketplace_id, fetchedBarter?.product?.nmid);
          setMarketplaceShortName(short);
          setProductLink(link);
        } else {
          throw new Error('Произошла ошибка при получении бартера');
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setBarterIsLoading(false);
      }
    }
    console.log('barter', barter)
    if (barter) {
      setCurrentBarter(barter);
    } else {
      fetchBarter();
    }
  }, [barter])

  if (barterIsLoading) {
    return <div>Загрузка данных о бартере...</div>;
  }

  if (!currentBarter) {
    return <div>Бартер не найден</div>;
  }

  const handleCopy = () => {
    const result = copyToClipboard(currentBarter?.product?.nmid, 'Вы скопировали артикул товара', 'Не удалось скопировать артикул товара');
    showToast(result.message, result.status);
  }

  const openBarter = () => {
    const product = {...currentBarter.product, barter: currentBarter};
    delete product.barter.product;
    navigate(`/store/products/${product.id}`, { state: { product: product } });
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container product-page' id='barter' data-barter-id={currentBarter?.id} data-product-id={currentBarter?.product?.nmid} data-product-brand={currentBarter?.product?.brand}>
        <div className='list gap-l'>
          <div className='list-item align-items-start'>
            <img className='product-image small' src={currentBarter?.product?.photos[0]} alt={currentBarter?.product?.title} />
            <div className='list gap-m'>
              <div className='list gap-xs'>
                <h3>{currentBarter?.product?.title}</h3>
                <small>{currentBarter?.product?.brand}</small>
              </div>
              <div className='list-item gap-s'>
                <Input id='product-nmid' name='product-nmid' value={currentBarter?.product?.nmid} readOnly fade={true} icon='content_copy' iconCallback={handleCopy} onClick={handleCopy} />
                <Button className='secondary w-auto size-input' icon='launch' onClick={() => window.open(productLink, '_blank')}>{marketplaceShortName}</Button>
              </div>
            </div>
          </div>
          <Button className='light w-100' icon='info' onClick={openBarter}>Информация о бартере</Button>
        </div>
        <BarterStatus barter={currentBarter} updateBarter={setCurrentBarter} />
      </div>
    </div>
  );
}

export default BarterPage;