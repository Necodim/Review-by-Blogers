import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Store.css';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import { useUserProfile } from '../../../hooks/UserProfileContext';
import { useHelpers } from '../../../hooks/useHelpers';
import Header from '../../Header/Header';
import SearchBar from '../../SearchBar/SearchBar';
import Link from '../../Button/Link';
import ProductsGrid from '../ProductsGrid';
import PreloaderContainer from '../../Preloader/PreloaderContainer';

const StoreSeller = () => {
  const { profile, loading } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastManager();
  const { getPlural } = useHelpers();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
          setActiveAndInactiveProducts(fetchedProducts);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (error) {
        setProducts([]);
        setFilteredProducts([]);
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

  const setActiveAndInactiveProducts = (productList) => {
    const active = [];
    const inactive = [];
    productList.forEach(product => {
      if (product.barter && product.barter.id) {
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
  };

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = products.filter(product => 
      product.nmid.toString().includes(lowerCaseQuery) ||
      product.subjectname.toLowerCase().includes(lowerCaseQuery) ||
      product.vendorcode.toLowerCase().includes(lowerCaseQuery) ||
      product.brand.toLowerCase().includes(lowerCaseQuery) ||
      product.title.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredProducts(filtered);
    setActiveAndInactiveProducts(filtered);
  };

  const openActiveProductsPage = () => {
    navigate('/store/products', { state: { products: activeBarters, title: 'В работе' } });
  };

  const openInactiveProductsPage = () => {
    navigate('/store/products', { state: { products: inactiveBarters, title: 'На паузе' } });
  };

  if (productsIsLoading) {
    return <PreloaderContainer text='Товары загружаются...' />;
  } else if (products.length === 0) {
    return <PreloaderContainer title='Нет товаров' text='У вас нет товаров. Загрузите товары, добавив API маркетплейса. Если товары не отобразятся, сообщите в поддержку.' />;
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='search'>
        <SearchBar onSearch={handleSearch} placeholder='Поиск товаров...' />
      </div>
      {activeBarters.length > 0 &&
        <div className='container' id='products-active'>
          <div className='list'>
            <div className='list-item'>
              <h1>В работе</h1>
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
              <h1>На паузе</h1>
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