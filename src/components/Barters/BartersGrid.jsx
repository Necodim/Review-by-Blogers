import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Barters.css';
import '../Store/Store.css';
import BarterCard from './BarterCard';

const BartersGrid = ({ barters }) => {
  const navigate = useNavigate();

  const initialBartersPlaceholder = new Array(4).fill({}).map((_, index) => ({
    placeholder: true,
    id: `barter-placeholder-${index}`,
    offer: {
      id: `offer-placeholder-${index}`,
      status: 'Загрузка...',
      instagram_username: 'username',
      updated_at: 'Дата и время',
    },
    product: {
      placeholder: true,
      nmid: `product-placeholder-${index}`,
    }
  }));
  const [displayBarters, setDisplayBarters] = useState(initialBartersPlaceholder);

  useEffect(() => {
    if (barters.length > 0) {
      const sortedBarters = barters.sort((a, b) => b.offer.updated_at > a.offer.updated_at);
      setDisplayBarters(sortedBarters);
    }
  }, [barters]);

  const handleBarterClick = (barter) => {
    navigate(`/barters/${barter.id}/${barter.offer.id}`, { state: { barter: barter } });
  }

  return (
    <div className='barter-cards'>
      {displayBarters.map((barter) => (
        <BarterCard
          key={barter.offer?.id}
          barter={barter}
          onClick={() => handleBarterClick(barter)}
        />
      ))}
    </div>
  );
}

export default BartersGrid;