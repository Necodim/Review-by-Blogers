import React from 'react';
import './Instructions.css';
import moment from 'moment';
import Icon from '../../../Icon/Icon';
import imgInstruction1 from '../../../../images/InstructionsAPI/Wildberries/instruction-1.png';
import imgInstruction2 from '../../../../images/InstructionsAPI/Wildberries/instruction-2.png';
import imgInstruction3 from '../../../../images/InstructionsAPI/Wildberries/instruction-3.png';
import imgInstruction4 from '../../../../images/InstructionsAPI/Wildberries/instruction-4.png';

const InstructionWildberries = () => {
  return (
    <div className='list'>
      <div className='list-item vertical'>
        <p>Войдите в настройки профиля.</p>
        <img className='instruction-img' src={imgInstruction1} />
      </div>
      <div className='list-item vertical'>
        <p>Откройте вкладку «Доступ к API» и нажмите кнопку «Создать новый токен».</p>
        <img className='instruction-img' src={imgInstruction2} />
      </div>
      <div className='list-item vertical'>
        <p>Задайте имя токена, поставьте галочку «Только на чтение...», выберите «Контент» и нажмите кнопку «Создать токен». Чтобы не запутаться в будущем, рекомендуем дать имя «{'Unpacks ' + moment().format('YYYY.MM.DD')}» – так вы будете понимать, для какого сервиса и когда создали токен.</p>
        <img className='instruction-img' src={imgInstruction3} />
      </div>
      <div className='list-item vertical'>
        <p>Скопируйте токен, перейдите обратно в приложение Unpacks и нажмите иконку <Icon icon='content_paste' size='small' /> в поле для ввода, чтобы вставить токен. После этого нажмите «Сохранить».</p>
        <img className='instruction-img' src={imgInstruction4} />
      </div>
    </div>
  )
}

export default InstructionWildberries;