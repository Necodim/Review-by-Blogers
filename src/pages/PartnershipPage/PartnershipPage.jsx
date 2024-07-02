import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import { useHelpers } from '../../hooks/useHelpers';
import api from '../../api/api';
import Header from '../../components/Header/Header';
import Heading1 from '../../components/Barters/Heading/Heading1';
import Input from '../../components/Form/Input';
import PaginationList from '../../components/Pagination/PaginationList';

const PartnershipPage = () => {
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();
  const { copyToClipboard } = useHelpers();

  const webAppRefUrl = 'https://t.me/unpacksbot/app?startapp=ref';

  const [errorMessage, setErrorMessage] = useState('');
  const [referralLink, setReferralLink] = useState(webAppRefUrl);
  const [referrals, setReferrals] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const link = webAppRefUrl + profile.id;
    setReferralLink(link);
  }, [profile]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const result = await api.getReferralsPaymentsByUserId();
        console.log(result)
        setReferrals(result)
        setCount(result.length);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    if (referrals.length === 0) {
      fetchReferrals();
    }
  }, [profile]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  const handleCopyReferralLink = () => {
    const result = copyToClipboard(referralLink, 'Вы успешно скопировали реферальную ссылку в буфер обмена', 'Скопировать ссылку не удалось');
    showToast(result.message, result.status);
  };

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='verification' >
        <Heading1 title='Партнёрская программа' />
        <div className='list gap-xs'>
          <p>Приглашайте друзей присоединиться к Unpacks и получайте 20% от каждой оплаты своих рефералов.</p>
          <p>Просто скопируйте ссылку и отправьте её другу:</p>
        </div>
        <div className='list'>
          <div className='list-item'>
            <Input
              id='ref-url'
              name='ref-url'
              title='Реферальная ссылка'
              placeholder={webAppRefUrl}
              value={referralLink}
              onChange={() => { }}
              icon='copy'
              iconCallback={handleCopyReferralLink}
              fade={true}
            />
          </div>
          <small>Такой высокий процент действует только до 31 июля. В последствии он будет снижаться.</small>
        </div>
      </div>

      <div className='container' id='referrals'>
        <Heading1 title='Мои рефералы' text={<small>{`Всего ${count} рефералов`}</small>}>
          {referrals.length > 0 &&
            <>Вы заработали {Math.round(0.2 * referrals.map(r => r.amount).reduce((acc, amount) => acc + parseFloat(amount), 0))} ₽</>
          }
        </Heading1>
        {referrals.length > 0 &&
          <PaginationList items={referrals} titles={['ID пользователя', 'Сумма платежа']} itemsPerPage={5} />
        }
        {!referrals.length > 0 && <div>У вас ещё нет рефералов. Поделитесь ссылкой с друзьями.</div>}
      </div>
    </div>
  );
};

export default PartnershipPage;