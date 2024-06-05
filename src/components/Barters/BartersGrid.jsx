import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Barters.css';
import '../Store/Store.css';
import BarterCard from './BarterCard';

const BartersGrid = ({ barters }) => {
  const navigate = useNavigate();

  const initialBartersPlaceholder = new Array(4).fill({}).map((_, index) => ({
    placeholder: true,
    id: `placeholder-${index}`,
    product: {
      placeholder: true,
      nmid: `product-placeholder-${index}`,
    }
  }));
  const [displayBarters, setDisplayBarters] = useState(initialBartersPlaceholder);

  useEffect(() => {
    if (barters.length > 0) {
      setDisplayBarters(barters);
    }
  }, [barters]);

  const handleBarterClick = (barter) => {
    navigate(`/barters/${barter.id}/${barter.offer.id}`, { state: { barter: barter } });
  }

  return (
    <div className='cards'>
      {displayBarters.map((barter) => (
        <BarterCard
          key={barter.id}
          barter={barter}
          onClick={() => handleBarterClick(barter)}
        />
      ))}
    </div>
  );
}

export default BartersGrid;