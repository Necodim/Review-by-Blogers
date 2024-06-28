import React, { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useToastManager } from '../../hooks/useToast.js';
import { useHelpers } from '../../hooks/useHelpers.js';
import Popup from './Popup.jsx';
import Button from '../Button/Button.jsx';
import Input from '../Form/Input.jsx';
import Icon from '../Icon/Icon.jsx';

const PopupBloggerInfo = ({ isOpen, onClose, userId }) => {
  const { copyToClipboard } = useHelpers();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [blogger, setBlogger] = useState({});
  const [phone, setPhone] = useState('');
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
      if (userId) {
        try {
          const user = await api.getUserById(userId);
          setBlogger(user);
          console.log('blogger:', user)
          user.username ? setTelegramLink('https://t.me/' + user.username) : false;
          if (user?.phone) {
            const phoneNumber = '+' + user.phone;
            setPhone(phoneNumber);
          }
          if (user?.card_number) {
            const cardNumber = user.card_number.replace(/(\d{4})(?=\d)/g, '$1 ');
            setCardnumber(cardNumber);
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
    }
    fetchBlogger();
  }, [userId]);

  const copyPhoneNumber = () => {
    const result = copyToClipboard(phone, 'Вы успешно скопировали номер телефона', 'Не удалось скопировать номер телефона');
    showToast(result.message, result.status);
  }

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
        <div className='list-item justify-content-start gap-xs'>
          {phone && <Icon icon='verified' style={ { opacity: .5 } } />}
          <h1>{(blogger.firstname || blogger.lastname) ? [blogger.firstname, blogger.lastname].join(' ') : 'Карточка блогера'}</h1>
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
        {phone && 
          <Input
            id='phone'
            name='phone'
            title='Номер телефона'
            value={phone}
            icon='phone'
            iconCallback={copyPhoneNumber}
            onChange={() => {}}
            readOnly={true}
          />
        }
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