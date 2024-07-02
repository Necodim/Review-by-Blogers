import React, { useEffect, useState } from 'react';
import { useToastManager } from '../../../hooks/useToast';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import api from '../../../api/api';
import Header from '../../Header/Header';
import Heading1 from '../../Barters/Heading/Heading1';
import AnimatedWrapper from '../../Animation/AnimatedWrapper';
import Link from '../../Button/Link';
import Form from '../../Form/Form';
import Input from '../../Form/Input';
import InstructionWildberries from './Instructions/Wildberries';

const SetWbApi = (props) => {
  const { showToast } = useToastManager();
  const { updateProfile } = useUserProfile()

  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (errorMessage && attemptedSubmit) {
      showToast(errorMessage, 'error');
      setAttemptedSubmit(false);
      setErrorMessage('');
    }
  }, [errorMessage, attemptedSubmit, showToast]);

  useEffect(() => {
    const validateJWT = (token) => {
      if (token.length > 0 && token.trim() !== '') {
        const parts = token.split('.');
        if (parts.length !== 3) {
          setErrorMessage('Неверный формат JWT');
          return false;
        }

        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const now = Date.now() / 1000;
          if (payload.exp && payload.exp < now) {
            setErrorMessage('Этот токен истек, создайте новый');
            return false;
          }
          return true;
        } catch (error) {
          setErrorMessage('Ошибка при декодировании или чтении API-ключа. Скорее всего допущена ошибка.');
          return false;
        }
      } else {
        return false;
      }
    }
    setErrorMessage('');
    setIsValid(validateJWT(token));
  }, [token]);

  useEffect(() => {
    if (!props.isOpen) {
      setToggle(false);
    }
  }, [props.isOpen]);

  const toggleVisibility = () => {
    setToggle(!toggle);
  }

  const handleApiChange = (event) => {
    setAttemptedSubmit(false);
    const { value } = event.target;
    setToken(value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (isValid) {
      const formData = Object.fromEntries(new FormData(event.target));
      showToast('Отправка данных...', 'loading');
      try {
        const result = await api.setApiWildberries(formData.token);
        if (result.message) {
          showToast(result.message, 'success');
          updateProfile({ api: { wildberries: { expired: false, token: true } } });
          showToast('Отлично. Теперь включите бартеры на товарах, которые хотите продвигать.', 'info');
          showToast('Товары обновлены. Перейдите в раздел «Товары», чтобы посмотреть обновления.', 'success');
        }
      } catch (error) {
        setErrorMessage(error.message);
        console.error(`${error.message}:`, error);
      }
    }
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='subscription'>
        <Heading1 title='API-ключ' text={<Link onClick={toggleVisibility}>Где взять?</Link>}>
          <AnimatedWrapper isOpen={toggle}>
						<InstructionWildberries />
          </AnimatedWrapper>
        </Heading1>
        <Form className='form-wrapper' btnicon='save' btntext='Сохранить' isDisabled={!isValid} onSubmit={handleSubmit}>
          <Input
            id='input-token'
            name='token'
            title='Введите API-ключ'
            icon='backspace'
            iconCallback={() => { setToken('') }}
            fade={true}
            placeholder='eyJhbGciOiJ...'
            value={token}
            onChange={handleApiChange}
            error={errorMessage}
          />
        </Form>
        <small>Если у вас до этого уже были загружены товары в наше приложение, их данные обновятся.</small>
      </div>
    </div>
  )
}

export default SetWbApi;