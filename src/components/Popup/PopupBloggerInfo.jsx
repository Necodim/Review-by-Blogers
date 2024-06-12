import React, { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useToastManager } from '../../hooks/useToast.js';
import { useHelpers } from '../../hooks/useHelpers.js';
import Popup from './Popup.jsx';
import Button from '../Button/Button.jsx';
import Input from '../Form/Input.jsx';

const PopupBloggerInfo = ({ isOpen, onClose, userId }) => {
  const { copyToClipboard } = useHelpers();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [blogger, setBlogger] = useState({});
  const [cardnumber, setCardnumber] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [instagramCoverage, setInstagramCoverage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchBlogger = async () => {
      try {
        const user = await api.getUserById(userId);
        setBlogger(user);
        console.log('blogger:', user)
        user.username ? setTelegramLink('https://t.me/' + user.username) : false;
        if (user?.card_number) {
          const number = user.card_number.replace(/(\d{4})(?=\d)/g, '$1 ');
          setCardnumber(number);
        }
        if (user?.instagram?.username) {
          const username = user?.instagram?.username.split('?')[0];
          setInstagramUsername(username);
          setInstagramLink('https://instagram.com/' + username);
        }
        if (user?.instagram?.coverage) {
          setInstagramCoverage(user?.instagram?.coverage);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    fetchBlogger();
  }, [userId]);

  const copyCardNumber = () => {
    const result = copyToClipboard(cardnumber.replace(/\s/g, ''), 'Вы успешно скопировали номер карты', 'Не удалось скопировать номер карты');
    showToast(result.message, result.status);
  }

  const openTelegramPage = () => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
  }

  const openInstagramPage = () => {
    window.open(instagramLink, '_blank', 'noopener,noreferrer');
  }

  return (
    <Popup id='popup-blogger' isOpen={isOpen} onClose={onClose}>
      <div className='list'>
        <div className='list-item'>
          <h2>{(blogger.firstname || blogger.lastname) ? [blogger.firstname, blogger.lastname].join(' ') : 'Карточка блогера'}</h2>
        </div>
      </div>
      <div className='list'>
        <div className='list-item'>
          <Button className={!telegramLink && 'disabled'} onClick={openTelegramPage}>Telegram</Button>
          <Button className={!instagramLink && 'disabled'} onClick={openInstagramPage}>Instagram</Button>
        </div>
      </div>
      {instagramCoverage && <div className='list-item'>{`Средние охваты: ${instagramCoverage}`}</div>}
      <div className='list'>
        <Input
          id='card-number'
          name='card-number'
          title='Номер карты'
          value={cardnumber}
          icon='content_copy'
          iconCallback={copyCardNumber}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </Popup>
  );
};

export default PopupBloggerInfo;