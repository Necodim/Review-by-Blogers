import React, { useState, useEffect } from 'react';
import api from '../../api/api';
// import { sortByKey } from '../../hooks/useHelpers';
import { useUserProfile } from '../../hooks/UserProfileContext';
import PreloaderContainer from '../../components/Preloader/PreloaderContainer';
import Header from '../../components/Header/Header';
import Heading1 from '../../components/Barters/Heading/Heading1';
import Input from '../../components/Form/Input';

const NotificationSettingsPage = () => {
  const { role } = useUserProfile();
  
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await api.getNotificationSettings();


        // const sortByKey = (arrayOfObjects, sortKey) => {
        //   arrayOfObjects.sort((a, b) => {
        //     if (a[sortKey] < b[sortKey]) {
        //       return -1;
        //     }
        //     if (a[sortKey] > b[sortKey]) {
        //       return 1;
        //     }
        //     return 0;
        //   });
        // };
        // const sortedSettings = sortByKey(response, 'event_type');
        if (role === 'blogger') {
          const filteredSettings = response.filter(setting => setting.event_type !== 'barter_new');
          setSettings(filteredSettings);
        } else {
          const filteredSettings = response.filter(setting => setting.event_type !== 'product_new');
          setSettings(filteredSettings);
        }
      } catch (error) {
        console.error('Ошибка при получении настроек уведомлений:', error);
      }
    }
    fetchNotificationSettings();
  }, [role]);

  const handleToggle = async (eventType) => {
    const updatedSettings = settings.map(setting =>
      setting.event_type === eventType ? { ...setting, is_enabled: !setting.is_enabled } : setting
    );
    setSettings(updatedSettings);
    const data = {
      eventType: eventType,
      isEnabled: !settings.find(setting => setting.event_type === eventType).is_enabled
    }
    try {
      const response = api.updateNotificationSetting(data);
      return response;
    } catch (error) {
      console.error('Ошибка при изменении настроек уведомлений:', error)
    }
  };

  const getEventTypeTranslate = (eventType) => {
    switch (eventType) {
      case 'barter_new':
        return 'Новые предложения о бартере';
      case 'barter_status':
        return 'Изменение статуса бартера';
      case 'product_new':
        return 'Новые бартеры';
    }
  }

  if (!settings) {
    return <PreloaderContainer text='Загружаю ваши настройки уведомлений...' />
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='notification-settings'>
        <Heading1 title='Настройки уведомлений' />
        <div className='list'>
          {settings && settings.map(setting => (
            <div className='list-item' key={setting.event_type}>
              <Input
                type='checkbox'
                id={'checkbox-' + setting.event_type}
                label={getEventTypeTranslate(setting.event_type)}
                checked={setting.is_enabled}
                onChange={() => handleToggle(setting.event_type)}
              />
            </div>
          ))}
        </div>
        <small>Изменения сразу же вступят в силу</small>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;