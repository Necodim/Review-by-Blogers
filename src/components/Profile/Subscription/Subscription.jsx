import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import moment from 'moment';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import PreloaderPage from '../../Preloader/PreloaderPage';
import Header from '../../Header/Header';
import PopupConfirmation from '../../Popup/PopupConfirmation';
import Link from '../../Button/Link';
import Button from '../../Button/Button';

const Subscription = () => {
  const navigate = useNavigate();

  const { cancelSellerSubscription } = api;
  const { profile, updateProfile } = useUserProfile();
  const { showToast } = useToastManager();
  const { getPlural, formatNumberToLocale } = useHelpers();

  const [tonConnectUI] = useTonConnectUI();

  const [testSubIndex, setTestSubIndex] = useState(0);
  const [prices, setPrices] = useState({});
  const [priceRubMonth, setPriceRubMonth] = useState('');
  const [priceRubYear, setPriceRubYear] = useState('');
  const [priceTonMonth, setPriceTonMonth] = useState('');
  const [priceTonYear, setPriceTonYear] = useState('');
  const [pricesIsLoading, setPricesIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAvaliable, setIsAvaliable] = useState(false);
  const [expiredDate, setExpiredDate] = useState('');
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      setPricesIsLoading(true);
      try {
        const fetchedPrices = await api.getPrices();
        if (fetchedPrices) {
          setPrices(fetchedPrices);
          setFetchedPrices(fetchedPrices)
        } else {
          throw new Error('Произошла ошибка при получении стоимости подписок');
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setPricesIsLoading(false);
      }
    }
    setTimeout(() => {
      fetchPrices();
    }, 1000 * 60 * 10);
    fetchPrices();
  }, []);

  const setFetchedPrices = (fetchedPrices) => {
    if (!!fetchedPrices.rub) {
      setPriceRubMonth(formatNumberToLocale(fetchedPrices?.rub?.month));
      setPriceRubYear(formatNumberToLocale(fetchedPrices?.rub?.year));
    }
    if (fetchedPrices.ton) {
      const nanotones = 1000000000; // 1000000000 = 1 TON
      setPriceTonMonth(fetchedPrices?.ton?.month * nanotones);
      setPriceTonYear(fetchedPrices?.ton?.year * nanotones);
    }
  }

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    if (profile) {
      setIsSubscribed(profile.subscription?.active);
      setIsAvaliable(profile.subscription?.avaliable);
      if (profile.subscription?.expired_at) {
        setExpiredDate(moment(profile.subscription?.expired_at).format('DD.MM.YYYY, HH:mm'));
      }
    }
  }, [profile]);

  const payWithRublesMonth = () => {
    if (isSubscribed) {
      showToast('У вас уже есть подписка', 'info');
      return;
    }
    navigate('/profile/subscription/subscribe', { state: { period: 'month' } });
  };

  const payWithRublesYear = () => {
    if (isSubscribed) {
      showToast('У вас уже есть подписка', 'info');
      return;
    }
    navigate('/profile/subscription/subscribe', { state: { period: 'year' } });
  };

  const payWithTonMonth = () => {
    if (isSubscribed) {
      showToast('У вас уже есть подписка', 'info');
      return;
    }
    const transaction = {
      messages: [
        {
          address: "UQDhqb6O3QqEuTjR73rKAcpL4eYBA-6LeZ_-G4Dqd-g-3mR7",
          amount: priceTonMonth
        }
      ]
    }
    tonConnectUI.sendTransaction(transaction)
  }

  const payWithTonYear = () => {
    if (isSubscribed) {
      showToast('У вас уже есть подписка', 'info');
      return;
    }
    const transaction = {
      messages: [
        {
          address: "UQDhqb6O3QqEuTjR73rKAcpL4eYBA-6LeZ_-G4Dqd-g-3mR7",
          amount: priceTonYear
        }
      ]
    }
    tonConnectUI.sendTransaction(transaction)
  }

  const cancelSubscription = async () => {
		try {
			const result = await cancelSellerSubscription();
			updateProfile({subscription: result});
			showToast(`Вы успешно отменили подписку. Сервис будет доступен до ${moment(result.next_charge_date).format('DD.MM.YYYY, HH:mm')}.`, 'success');
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setIsPopupConfirmationOpen(false);
		}
	}

  const testSubscription = () => {
    if (testSubIndex === 5) {
      navigate('/profile/subscription/subscribe', { state: { period: 'test' } });
    } else {
      setTestSubIndex(testSubIndex + 1);
    }
  }

  if (pricesIsLoading) {
    return <PreloaderPage text='Загружаю стоимость подписки...' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='subscription'>
        <div className='list'>
          <div className='list-item'>
            <h1 onClick={testSubscription}>Подписка</h1>
            {isSubscribed &&
              <Link onClick={() => setIsPopupConfirmationOpen(true)}>Отменить</Link>
            }
          </div>
        </div>
        <div className='list'>
          <div className='list-item justify-content-start gap-s'>
            <h3>Текущий статус</h3>
            {isSubscribed ? 'Подписка есть' : isAvaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробный период' : 'Нет подписки'}
          </div>
          {(isSubscribed || isAvaliable) &&
            <small className='list-item'>{(isSubscribed ? 'Следующее списание ' : 'Сервис доступен до ') + expiredDate}</small>
          }
          {(!isSubscribed && !isAvaliable) &&
            <small className='list-item'>{`Еще ${profile.trial['barters-left']} ${getPlural(profile.trial['barters-left'], 'бартер', 'бартера', 'бартеров')}`}</small>
          }
        </div>
        <div className='list'>
          <div className='list-item'>
            <h3>Описание</h3>
          </div>
          <div className='list-item'>
            С подпиской вы не ограничены в количестве создаваемых бартеров и количестве принятых предложений о сотрудничестве.
            {/* А также можете назначать менеджеров для управления своими бартерами. */}
          </div>
        </div>
        <div className='list'>
        <div  className='list-item'>
            <small className='w-100 text-center'>Месяц</small>
            <small className='w-100 text-center'>Год</small>
          </div>
          <div  className='list-item gap-xs'>
            <Button icon='currency_ruble' onClick={payWithRublesMonth}>{priceRubMonth ? priceRubMonth + ' ₽' : 'Загрузка'}</Button>
            <Button icon='currency_ruble' onClick={payWithRublesYear}>{priceRubYear ? priceRubYear + ' ₽' : 'Загрузка'}</Button>
          </div>
          <div  className='list-item gap-xs'>
            <Button className='list-item' icon='account_balance_wallet' onClick={payWithTonMonth}>{prices?.ton?.month ? prices?.ton?.month + ' TON' : 'Загрузка'}</Button>
            <Button className='list-item' icon='account_balance_wallet' onClick={payWithTonYear}>{prices?.ton?.year ? prices?.ton?.year + ' TON' : 'Загрузка'}</Button>
          </div>
          <small className='list-item'>Оплата в TON выгоднее. Для оплаты подключите кошелёк в настройках.</small>
        </div>
      </div>

      {isSubscribed &&
        <PopupConfirmation
          id='popup-cancel-subscription'
          title='Отмена подписки'
          text='Вы действительно хотите отменить подписку?'
          descr={
            <div className='list'>
              <p className='list-item'>{`Это действие необратимо! Вы не сможете пользоваться сервисом после истечения оплаченного срока действия${expiredDate ? ` (${expiredDate})` : ''}.`}</p>
              <p className='list-item'>После окончания срока действия вы не&nbsp;будете получать предложения о&nbsp;бартере, но&nbsp;все ваши данные и&nbsp;товары сохранятся.</p>
            </div>
          }
          isOpen={isPopupConfirmationOpen}
          onClose={() => setIsPopupConfirmationOpen(false)}
          onConfirmation={cancelSubscription}
          timer={4}
        />
      }
    </div>
  )
}

export default Subscription;