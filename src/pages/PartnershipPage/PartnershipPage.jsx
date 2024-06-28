import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast';
import { useHelpers } from '../../hooks/useHelpers';
import Header from '../../components/Header/Header';
import Input from '../../components/Form/Input';

const PartnershipPage = () => {
  const { profile } = useUserProfile();
  const { showToast } = useToastManager();
  const { copyToClipboard } = useHelpers();

  const webAppRefUrl = 'https://t.me/unpacksbot/app?startapp=ref';

  const [errorMessage, setErrorMessage] = useState('');
  const [referralLink, setReferralLink] = useState(webAppRefUrl);

  useEffect(() => {
    const link = webAppRefUrl + profile.id;
    setReferralLink(link);
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
        <div className='list'>
          <div className='list-item'>
            <h1>Партнёрская программа</h1>
          </div>
          <div className='list-item'>
            <div className='list gap-xs'>
              <p>На данный момент партнёрская программа находится в разработке.</p>
              <p>Однако вы уже сейчас можете приглашать пользователей по своей реферальной ссылке.</p>
              <p>Все ваши рефералы будут учтены после запуска пртнёрской программы.</p>
            </div>
          </div>
        </div>
        <div className='list'>
          <div className='list-item'>
            <Input
              id='ref-url'
              name='ref-url'
              title='Реферальная ссылка'
              placeholder={webAppRefUrl}
              value={referralLink}
              onChange={() => {}}
              icon='copy'
              iconCallback={handleCopyReferralLink}
              fade={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPage;