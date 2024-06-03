import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Store.css';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useHelpers } from '../../../hooks/useHelpers';
import Header from '../../Header/Header';
import Link from '../../Button/Link';
import ProductsGrid from '../ProductsGrid';

const StoreSeller = () => {
  const { profile, loading } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastManager();
  const { getPlural } = useHelpers();

  const [products, setProducts] = useState([]);
  const [productsIsLoading, setProductsIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeBarters, setActiveBarters] = useState([]);
  const [inactiveBarters, setInactiveBarters] = useState([]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    if (location.state?.showPopupAfterBloggerOnboarding) {
      console.log('Показываем попап');
      console.log(location);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      setProductsIsLoading(true);
      try {
        const fetchedProducts = await api.getProductsWithBartersByUserId(profile.id);
        if (Array.isArray(fetchedProducts)) {
          console.log(fetchedProducts);
          setProducts(fetchedProducts);

          const active = [];
          const inactive = [];
          fetchedProducts.forEach(product => {
            if (product.barter) {
              if (!product.barter.closedat || new Date(product.barter.closedat) > new Date()) {
                active.push(product);
              } else {
                inactive.push(product);
              }
            } else {
              inactive.push(product);
            }
          });

          setActiveBarters(active);
          setInactiveBarters(inactive);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (error) {
        setProducts([]);
        setActiveBarters([]);
        setInactiveBarters([]);
        setErrorMessage(error.message);
        console.error(error.message);
      } finally {
        setProductsIsLoading(false);
      }
    };

    if (!loading && profile.id) {
      fetchData();
    }
  }, [loading, profile.id]);

  const titles = {
    active: 'В работе',
    inactive: 'На паузе'
  }

  const openActiveProductsPage = () => {
    navigate('/store/products', { state: { products: activeBarters, title: titles.active } });
  }

  const openInactiveProductsPage = () => {
    navigate('/store/products', { state: { products: inactiveBarters, title: titles.inactive } });
  }

  return (
    <div className='content-wrapper'>
      <Header />
      {activeBarters.length > 0 &&
        <div className='container' id='products-active'>
          <div className='list'>
            <div className='list-item'>
              <h2>{titles.active}</h2>
              <Link onClick={openActiveProductsPage}>Ещё</Link>
            </div>
            <div className='list-item'>
              <small>Всего {activeBarters.length + ' ' + getPlural(activeBarters.length, 'товар', 'товара', 'товаров')} </small>
            </div>
          </div>
          <ProductsGrid
            products={activeBarters.slice(0, 2)}
          />
        </div>
      }
      {inactiveBarters.length > 0 &&
        <div className='container' id='products-inactive'>
          <div className='list'>
            <div className='list-item'>
              <h2>{titles.inactive}</h2>
              <Link onClick={openInactiveProductsPage}>Ещё</Link>
            </div>
            <div className='list-item'>
              <small>Всего {inactiveBarters.length + ' ' + getPlural(inactiveBarters.length, 'товар', 'товара', 'товаров')} </small>
            </div>
          </div>
          <ProductsGrid
            products={inactiveBarters.slice(0, 2)}
          />
        </div>
      }
    </div>
  );
};

export default StoreSeller;
