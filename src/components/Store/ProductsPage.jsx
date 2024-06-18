import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Store.css';
import api from '../../api/api';
import { useSelectedProducts } from '../../hooks/useSelectProductsContext';
import { useToastManager } from '../../hooks/useToast';
import { useHelpers } from '../../hooks/useHelpers';
import SearchBar from '../SearchBar/SearchBar';
import Header from '../Header/Header';
import Button from '../Button/Button';
import Link from '../Button/Link';
import ProductsGrid from './ProductsGrid';
import PopupEditProducts from '../Popup/PopupEditProducts';
import PopupTaskWrite from '../Popup/PopupTaskWrite';
import PopupConfirmation from '../Popup/PopupConfirmation';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { products, title } = location.state || { products: [], title: 'Товары' };

  const { selectedProducts, setSelectedProducts } = useSelectedProducts();
  const { showToast } = useToastManager();
  const { getPlural } = useHelpers();

  const [errorMessage, setErrorMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupEditProductsVisible, setIsPopupEditProductsVisible] = useState(false);
  const [isPopupTaskWriteVisible, setIsPopupTaskWriteVisible] = useState(false);
  const [isPopupConfirmationBarterCloseVisible, setIsPopupConfirmationBarterCloseVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (products.length === 0) {
      navigate('/store');
    } else {
      setFilteredProducts(products);
    }
  }, [products, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    // Очистка selectedProducts при размонтировании компонента
    return () => {
      setSelectedProducts([]);
    };
  }, [setSelectedProducts]);

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...filteredProducts];
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
  }, [filteredProducts, sortConfig]);

  const SortIndicator = ({ isActive, direction }) => {
    if (!isActive) return null;

    return (
      <span className='m-l-xxxs'>{direction === 'ascending' ? '↓' : '↑'}</span>
    );
  };

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
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setSelectedProducts([]);
    }
  };

  const toggleSelectAllProducts = () => {
    if (selectedProducts.length < products.length) {
      setSelectedProducts(products);
    } else {
      setSelectedProducts([]);
    }
  };

  const openPopupEditProducts = () => {
    if (selectedProducts.length > 0) setIsPopupEditProductsVisible(true);
  };

  const openPopupTaskWrite = () => {
    setIsPopupEditProductsVisible(false);
    setIsPopupTaskWriteVisible(true);
  };

  const openPopupConfirmation = () => {
    setIsPopupEditProductsVisible(false);
    setIsPopupConfirmationBarterCloseVisible(true);
  };

  const closeBarters = async () => {
    setIsPopupConfirmationBarterCloseVisible(true);
    const idsToClose = selectedProducts.map(product => product.barter.id);
    const idsUnique = [...new Set(idsToClose)];
    const ids = idsUnique.filter(id => id !== null && id !== undefined);
    if (ids.length === 0) {
      setErrorMessage('У этих товаров нет открытых бартеров.');
      return;
    }

    const data = { ids: ids };

    try {
      const closedBarters = await api.closeBarters(data);
      const count = closedBarters.length;
      if (count > 0) {
        showToast(`Было закрыто ${count} ${getPlural(count, 'бартер', 'бартера', 'бартеров')}`, 'success');
      } else {
        showToast('Ни один бартер не был закрыт', 'info');
      }
    } catch (error) {
      const message = 'Не удалось закрыть бартер(-ы)';
      setErrorMessage(message);
      console.error(message, error);
    }
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
  };

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container' id='search'>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className='container' id='products'>
        <div className='list'>
          <div className='list-item'>
            <h1>{title}</h1>
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
        />
        {isEditing && <Button onClick={openPopupEditProducts} className={selectedProducts.length > 0 ? 'sticky b-s shadow' : 'relative b-0 disabled'} icon='edit'>Редактировать</Button>}
      </div>
      <PopupEditProducts
        isOpen={isPopupEditProductsVisible}
        onClose={() => setIsPopupEditProductsVisible(false)}
        onBarterOpen={openPopupTaskWrite}
        onBarterClose={openPopupConfirmation}
      />
      <PopupTaskWrite
        isOpen={isPopupTaskWriteVisible}
        onClose={() => setIsPopupTaskWriteVisible(false)}
        selectedProducts={selectedProducts}
      />
      <PopupConfirmation
        id='popup-barter-close'
        title='Вы уверены?'
        text={`Вы точно хотите закрыть бартер${selectedProducts.length > 1 ? 'ы' : ''}? Текущие сделки по ${selectedProducts.length > 1 ? 'данным товарам' : 'данному товару'} закрыты не будут.`}
        descr={`В будущем ${selectedProducts.length > 1 ? 'их' : 'его'} можно будет снова открыть`}
        isOpen={isPopupConfirmationBarterCloseVisible}
        onClose={() => setIsPopupConfirmationBarterCloseVisible(false)}
        onConfirmation={closeBarters}
        timer={4}
      />
    </div>
  );
};

export default ProductsPage;