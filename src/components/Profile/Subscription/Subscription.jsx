import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useToastManager } from '../../../hooks/useToast';
import moment from 'moment';
import Header from '../../Header/Header';
import PopupConfirmation from '../../Popup/PopupConfirmation';
import Link from '../../Button/Link';
import Button from '../../Button/Button';

const Subscription = () => {
  const { profile, cancelSubscription } = useUserProfile();
  const { showToast } = useToastManager();

  const [tonConnectUI] = useTonConnectUI();

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

  const payWithRubles = () => {
    if (isSubscribed) {
      setErrorMessage('У вас уже есть подписка');
      return;
    }
    navigate('/profile/subscription/subscribe');
  }

  const payWithTon = () => {
    const transaction = {
      messages: [
        {
          address: "UQDhqb6O3QqEuTjR73rKAcpL4eYBA-6LeZ_-G4Dqd-g-3mR7",
          amount: "10000000"
        }
      ]
    }
    tonConnectUI.sendTransaction(transaction)
  }

  const cancellingSubscription = async () => {
    await cancelSubscription();
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='subscription'>
        <div className='list'>
          <div className='list-item'>
            <h2>{isSubscribed ? 'Подписка' : isAvaliable ? 'Подписка отменена' : profile.trial.active ? 'Пробный период' : 'Нет подписки'}</h2>
            {isSubscribed &&
              <Link onClick={() => setIsPopupConfirmationOpen(true)}>Отменить</Link>
            }
          </div>
          {isSubscribed && isAvaliable && <div className='list-item'>{(isSubscribed ? 'Следующее списание ' : 'Сервис доступен до ') + expiredDate}</div>}
          <div className='list-item'>
            С подпиской вы не ограничены в количестве создаваемых бартеров и количестве принятых предложений о сотрудничестве.
            {/* А также можете назначать менеджеров для управления своими бартерами. */}
          </div>
        </div>
        {!isSubscribed &&
          <div className='list'>
            <div className='list-item'>
              <Button className='list-item' icon='currency_ruble' onClick={payWithRubles}>Оформить за рубли</Button>
            </div>
            <div className='list-item'>
              <Button className='list-item' icon='account_balance_wallet' onClick={payWithTon}>Оформить с помощью TON</Button>
            </div>
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
          onConfirmation={cancellingSubscription}
          timer={4}
        />
      }
    </div>
  )
}

export default Subscription;