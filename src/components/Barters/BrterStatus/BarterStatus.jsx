import React from 'react';
import BarterStatusQueued from './BarterStatusQueued';
import BarterStatusCreated from './BarterStatusCreated';
import BarterStatusSended from './BarterStatusSended';
import BarterStatusProgress from './BarterStatusProgress';
import BarterStatusPlanned from './BarterStatusPlanned';
import BarterStatusReported from './BarterStatusReported';
import BarterStatusClosed from './BarterStatusClosed';
import BarterStatusRefused from './BarterStatusRefused';

const BarterStatus = ({ offer, updateOffer }) => {
  switch (offer.status) {
    case 'queued': // Предложение находится в очереди на обработку, т.к. у блогера много активных бартеров
      return <BarterStatusQueued />
    case 'created': // Предложение создано, но еще не обработано
      return <BarterStatusCreated offer={offer} updateOffer={updateOffer} />
    case 'sended': // Средства на покупку товаров отправлены
      return <BarterStatusSended offer={offer} updateOffer={updateOffer} />
    case 'progress': // Предложение обрабатывается (статус, если не sended и не reported)
      return <BarterStatusProgress offer={offer} updateOffer={updateOffer} />
    case 'planned': // Блогер запланировал дату рекламной кампании
      return <BarterStatusPlanned offer={offer} updateOffer={updateOffer} />
    case 'reported': // Предложение отмечено как выполненное
      return <BarterStatusReported offer={offer} updateOffer={updateOffer} />
    case 'closed': // Предложение закрыто (все обяхательства выполнены)
      return <BarterStatusClosed offer={offer} />
    case 'refused': // Предложение отклонено
      return <BarterStatusRefused offer={offer} />
    default:
      return <div>Произошла ошибка при загрузке статуса текущего бартера</div>;
  }
}

export default BarterStatus;