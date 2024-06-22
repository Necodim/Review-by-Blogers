import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Barters.css';
import '../Store/Store.css';
import { useHelpers } from '../../hooks/useHelpers';
import BarterCard from './BarterCard';

const BartersGrid = ({ offers }) => {
  const navigate = useNavigate();

  const { sortDatesByKey } = useHelpers();

  const initialOffersPlaceholder = new Array(2).fill({}).map((_, index) => ({
    id: `offer-placeholder-${index}`,
    status: 'Загрузка...',
    instagram_username: 'username',
    updated_at: 'Дата и время',
    barter: {
      placeholder: true,
      id: `barter-placeholder-${index}`,
    },
    product: {
      placeholder: true,
      nmid: `product-placeholder-${index}`,
    }
  }));

  const [displayOffers, setDisplayOffers] = useState(initialOffersPlaceholder);

  useEffect(() => {
    if (offers && offers.length > 0) {
      const sortedOffers = sortDatesByKey(offers, 'updated_at');
      setDisplayOffers(sortedOffers);
    }
  }, [offers]);

  const handleBarterClick = (offer) => {
    navigate(`/barters/${offer.barter.id}/${offer.id}`, { state: { barter: offer } });
  }

  return (
    <div className='barter-cards'>
      {displayOffers.map((offer) => (
        <BarterCard
          key={offer.id}
          offer={offer}
          onClick={() => handleBarterClick(offer)}
        />
      ))}
    </div>
  );
}

export default BartersGrid;