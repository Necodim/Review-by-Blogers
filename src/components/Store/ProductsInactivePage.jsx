import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './Store.css';
import { useTelegram } from '../../hooks/useTelegram';
import { useToastManager } from '../../hooks/useToast';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import ProductsGrid from './ProductsGrid';
import PopupEditProducts from './PopupEditProducts';
import PopupWriteTask from './PopupWriteTask';

const ProductsInactivePage = () => {
  const location = useLocation();

  const { isAvailable, showBackButton } = useTelegram();
  const { showToast } = useToastManager();

  const [errorMessage, setErrorMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isPopupEditProductsVisible, setIsPopupEditProductsVisible] = useState(false);
  const [isPopupWriteTaskVisible, setIsPopupWriteTaskVisible] = useState(false);

  useEffect(() => {
    if (isAvailable) showBackButton();
  }, [isAvailable, showBackButton]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  const { products } = location.state || { products: [] };

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const SortIndicator = ({ isActive, direction }) => {
    if (!isActive) return null;

    return (
      <span className='m-l-xxxs'>{direction === 'ascending' ? '↓' : '↑'}</span>
    );
  }

  const handleSort = (key) => {
    setSortConfig((currentSortConfig) => {
      if (currentSortConfig.key === key) {
        return {
          key,
          direction: currentSortConfig.direction === 'ascending' ? 'descending' : 'ascending'
        };
      }
      return { key, direction: 'ascending' };
    });
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setSelectedProducts([]);
    }
  }

  const toggleSelectAllProducts = () => {
    if (selectedProducts.length < products.length) {
      // Если не все товары выделены, выделяем все
      setSelectedProducts(products.map(product => product.nmid));
    } else {
      // Если все товары выделены, снимаем выделение
      setSelectedProducts([]);
    }
  }

  const openPopupEditProducts = () => {
    if (selectedProducts.length > 0) setIsPopupEditProductsVisible(true);
  }

  const openPopupWriteTask = () => {
    setIsPopupEditProductsVisible(false);
    setIsPopupWriteTaskVisible(true);
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='products'>
        <div className='list'>
          <div className='list-item'>
            <h2>На&nbsp;паузе</h2>
            {products.length > 0 && <Link onClick={toggleEdit}>{isEditing ? 'Отменить' : 'Редактировать'}</Link>}
          </div>
          {isEditing &&
            <div className='list-item justify-content-start gap-xs'>
              <Link onClick={toggleSelectAllProducts}>
                <small>{selectedProducts.length < products.length ? 'Выделить все' : 'Снять выделение'}</small>
              </Link>
            </div>
          }
          {!isEditing &&
            <div className='list-item justify-content-start gap-xs'>
              <small>Сортировать по:</small>
              <small>
                <Link onClick={() => handleSort('title')}>названию</Link>
                <SortIndicator
                  isActive={sortConfig.key === 'title'}
                  direction={sortConfig.key === 'title' ? sortConfig.direction : null}
                />
              </small>
              <small>
                <Link onClick={() => handleSort('updatedat')}>дате изменения</Link>
                <SortIndicator
                  isActive={sortConfig.key === 'updatedat'}
                  direction={sortConfig.key === 'updatedat' ? sortConfig.direction : null}
                />
              </small>
            </div>
          }
        </div>
        <ProductsGrid
          products={sortedProducts}
          isEditing={isEditing}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
        {isEditing && <Button onClick={openPopupEditProducts} className={selectedProducts.length > 0 ? 'sticky b-s shadow' : 'relative b-0 disabled'} icon='edit'>Редактировать</Button>}
      </div>
      <PopupEditProducts
        isOpen={isPopupEditProductsVisible}
        onClose={() => setIsPopupEditProductsVisible(false)}
        onWriteTask={openPopupWriteTask}
      />
      <PopupWriteTask
        isOpen={isPopupWriteTaskVisible}
        onClose={() => setIsPopupWriteTaskVisible(false)}
      />
    </div>
  );
};

export default ProductsInactivePage;