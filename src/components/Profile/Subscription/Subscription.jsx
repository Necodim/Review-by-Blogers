import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import moment from 'moment';
import api from '../../../api/api';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import { useHelpers } from '../../../hooks/useHelpers';
import Header from '../../Header/Header';
import PopupConfirmation from '../../Popup/PopupConfirmation';
import Link from '../../Button/Link';
import Button from '../../Button/Button';

const Subscription = () => {
  const navigate = useNavigate();

  const { cancelSellerSubscription } = api;
  const { profile, updateProfile } = useUserProfile();
  const { showToast } = useToastManager();
  const { getPlural } = useHelpers();

  const [tonConnectUI] = useTonConnectUI();

  const [testSubIndex, setTestSubIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAvaliable, setIsAvaliable] = useState(false);
  const [expiredDate, setExpiredDate] = useState('');
  const [isPopupConfirmationOpen, setIsPopupConfirmationOpen] = useState(false);

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

  const payWithTon = () => {
    if (isSubscribed) {
      showToast('У вас уже есть подписка', 'info');
      return;
    }
    const transaction = {
      messages: [
        {
          address: "UQDhqb6O3QqEuTjR73rKAcpL4eYBA-6LeZ_-G4Dqd-g-3mR7",
          amount: "5990000000" // 1000000000 = 1 TON
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
        {!isSubscribed &&
          <div className='list'>
            <div  className='list-item gap-xs'>
              <Button icon='currency_ruble' onClick={payWithRublesMonth}>4990 ₽/мес.</Button>
              <Button icon='currency_ruble' onClick={payWithRublesYear}>39000 ₽/год</Button>
            </div>
            <Button className='list-item' icon='account_balance_wallet' onClick={payWithTon}>5.99 TON / мес.</Button>
            <small className='list-item'>Оплата в TON выгоднее. Для оплаты подключите кошелёк в настройках.</small>
          </div>
        }
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