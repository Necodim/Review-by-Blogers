import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Barters.css';
import moment from 'moment';
import api from '../../api/api';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import { useHelpers } from '../../hooks/useHelpers';
import Preloader from '../Preloader/Preloader';
import Header from '../Header/Header';
import Input from '../Form/Input';
import Button from '../Button/Button';
import BarterStatus from './BrterStatus/BarterStatus';
import PopupTaskRead from '../Popup/PopupTaskRead';
import PopupBloggerInfo from '../Popup/PopupBloggerInfo';

const BarterPage = () => {
  const location = useLocation();

  const { barterId } = useParams();
  const { barter } = location.state || {};

  const { role } = useUserProfile();
  const { showToast } = useToastManager();
  const { copyToClipboard, getBarterInfo } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [currentBarter, setCurrentBarter] = useState(barter);
  const [barterIsLoading, setBarterIsLoading] = useState(false);
  const [productLink, setProductLink] = useState('');
  const [marketplaceShortName, setMarketplaceShortName] = useState('');
  const [bloggerId, setBloggerId] = useState(null);
  const [isPopupTaskReadVisible, setIsPopupTaskReadVisible] = useState(false);
  const [isPopupBloggerInfoOpen, setIsPopupBloggerInfoOpen] = useState(false);

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
        console.log('fetchedBarter', fetchedBarter);
        if (fetchedBarter) {
          const info = await getBarterInfo(fetchedBarter);
          setMarketplaceShortName(info.short)
          setProductLink(info.link)
          setCurrentBarter(fetchedBarter)
          setBloggerId(fetchedBarter.offer.user_id)
        } else {
          throw new Error('Произошла ошибка при получении бартера');
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setBarterIsLoading(false);
      }
    };

    if (!barter) {
      fetchBarter();
    }
    console.log('barterId', barterId)
    console.log('barter', barter)
    console.log('current', currentBarter)
  }, [barterId]);

  const handleCopy = () => {
    const result = copyToClipboard(currentBarter?.product?.nmid, 'Вы скопировали артикул товара', 'Не удалось скопировать артикул товара');
    showToast(result.message, result.status);
  };

  const openTask = () => {
    setIsPopupTaskReadVisible(true);
  }

  if (barterIsLoading) {
    return <Preloader>Загрузка...</Preloader>;
  }

  if (!currentBarter) {
    return (
      <div className='content-wrapper'>
        <Header />
        <div className='container' id='barter'>
          <div className='list'>
            <div className='list-item'>
              <h2>Бартер не найден</h2>
            </div>
            <div className='list-item'>
              <p>Попробуйте ещё раз...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
                <div className='list-item'>
                  <h3>{currentBarter?.product?.title}</h3>
                </div>
                {currentBarter?.product?.brand &&
                  <div className='list-item'>
                    <small>Бренд: {currentBarter?.product?.brand}</small>
                  </div>
                }
              </div>
              <div className='list-item gap-s'>
                <Input id='product-nmid' name='product-nmid' value={currentBarter?.product?.nmid} readOnly fade={true} icon='content_copy' iconCallback={handleCopy} onClick={handleCopy} />
                <Button className='secondary w-auto size-input' icon='launch' onClick={() => window.open(productLink, '_blank')}>{marketplaceShortName}</Button>
              </div>
              <div className='list-item'>
                <small>Изменено: {moment(barter?.offer?.updated_at).format('DD.MM.YYYY в HH:mm')}</small>
              </div>
            </div>
          </div>
          <div className='list'>
            <div className='list-item'>
              <Button className='light' icon='format_list_bulleted' onClick={openTask}>Смотреть ТЗ</Button>
              {role === 'seller' && <Button className='light' icon='contact_page' onClick={() => setIsPopupBloggerInfoOpen(true)}>О блогере</Button>}
            </div>
          </div>
        </div>
      </div>
      <div className='container barter-offer-status' id='status'>
        <BarterStatus key={currentBarter?.id + '-' + currentBarter?.offer.status} barter={currentBarter} updateBarter={setCurrentBarter} />
      </div>

      {(!!barter?.task || !!barter?.brand_instagram || !!barter?.need_feedback) &&
        <PopupTaskRead
          isOpen={isPopupTaskReadVisible}
          onClose={() => setIsPopupTaskReadVisible(false)}
          barter={barter}
        />
      }
      {role === 'seller' && bloggerId &&
        <PopupBloggerInfo isOpen={isPopupBloggerInfoOpen} onClose={() => setIsPopupBloggerInfoOpen(false)} userId={bloggerId} />
      }
    </div>
  );
};

export default BarterPage;
