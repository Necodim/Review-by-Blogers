import React from 'react';
import BarterStatusQueued from './BarterStatusQueued';
import BarterStatusCreated from './BarterStatusCreated';
import BarterStatusSended from './BarterStatusSended';
import BarterStatusProgress from './BarterStatusProgress';
import BarterStatusPlanned from './BarterStatusPlanned';
import BarterStatusReported from './BarterStatusReported';
import BarterStatusClosed from './BarterStatusClosed';
import BarterStatusRefused from './BarterStatusRefused';

const BarterStatus = ({ barter, updateBarter }) => {
  switch (barter.offer.status) {
    case 'queued': // Предложение находится в очереди на обработку, т.к. у блоггера много активных бартеров
      return <BarterStatusQueued />
    case 'created': // Предложение создано, но еще не обработано
      return <BarterStatusCreated barter={barter} updateBarter={updateBarter} />
    case 'sended': // Средства на покупку товаров отправлены
      return <BarterStatusSended barter={barter} updateBarter={updateBarter} />
    case 'progress': // Предложение обрабатывается (статус, если не sended и не reported)
      return <BarterStatusProgress />
    case 'planned': // Блоггер запланировал дату рекламной кампании
      return <BarterStatusPlanned />
    case 'reported': // Предложение отмечено как выполненное
      return <BarterStatusReported />
    case 'closed': // Предложение закрыто (все обяхательства выполнены)
      return <BarterStatusClosed />
    case 'refused': // Предложение отклонено
      return <BarterStatusRefused reason={barter.offer?.reason} />
    default:
      return <div>Произошла ошибка при загрузке статуса текущего бартера</div>;
  }
}

export default BarterStatus;