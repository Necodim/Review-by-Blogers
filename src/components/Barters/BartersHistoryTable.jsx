import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Barters.css';
import '../Store/Store.css';
import Heading1 from './Heading/Heading1';

const BartersHistoryTable = ({ barters }) => {
  const navigate = useNavigate();

  const initialBarterHistoryPlaceholder = new Array(5).fill({}).map((_, index) => ({
    placeholder: true,
    id: `id-${index}`,
    date: '11.02.2024',
    blogger: {
      'instagram-username': '@snezone'
    },
    product: {
      title: 'Загрузка названия товара',
    }
  }));
  const [bartersHistory, setBartersHistory] = useState(initialBarterHistoryPlaceholder);
  const [bartersHistoryIsLoading, setBartersHistoryIsLoading] = useState(true);

  useEffect(() => {
    if (barters.length > 0) {
      setBartersHistory(barters);
    }
  }, [barters]);

  const openBarter = (barter) => {
    navigate(`/barters/${barter.id}/${barter.offer.id}`);
  }

  const goToHistory = () => {
    navigate(`/barters/history`);
  }

  return (
    <div className='container' id='barter-history' >
      <Heading1 title='История' text={<Link onClick={goToHistory}>Ещё</Link>} />
      <div className='list'>
        {bartersHistory.map((barter, index) => (
          <div
            key={barter.id}
            className='list-item barter-card-wrapper'
            // onClick={() => { openBarter(barter) }}
            data-barter-id={barter.id}
          >
            <div className='list list-item vertical barter-card'>
              <div className='list-item barter-title'>{barter.product?.title}</div>
              <div className='list list-item barter-content'>
                <small>{barter.date}</small>
                <small>{barter.blogger?.['instagram-username']}</small>
              </div>
            </div>
            <Icon icon='sync' className='self-start' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BartersHistoryTable;