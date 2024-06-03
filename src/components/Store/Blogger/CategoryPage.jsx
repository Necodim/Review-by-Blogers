import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import Header from '../../Header/Header';
import ProductsGrid from '../ProductsGrid';

const CategoryPage = () => {
  const { subCategoryId } = useParams();

  const [categoryName, setCategoryName] = useState('Категория');
  const [products, setProducts] = useState([]);
  const [productsIsLoading, setProductsIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { showToast } = useToastManager();

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const getCategoryName = async () => {
      try {
        const subCategory = await api.getSubCategory(subCategoryId);
        setCategoryName(subCategory.name);
      } catch (error) {
        setCategoryName('Неизвестная категория');
        setErrorMessage('Не удалось получить данные о категории');
        console.error(error);
      }
    }

    const fetchData = async () => {
      setProductsIsLoading(true);
      try {
        const fetchedProducts = await api.setCategoryPage(subCategoryId);
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (error) {
        setErrorMessage(error.message);
        setProducts([]);
        console.error(error);
      } finally {
        setProductsIsLoading(false);
      }
    }

    getCategoryName();
    fetchData();
  }, [subCategoryId]);

  if (productsIsLoading) {
    return <div>Загрузка данных категории...</div>;
  } else if (errorMessage) {
    return <div>Ошибка: {errorMessage}</div>;
  } else {
    return (
      <div className='content-wrapper'>
        <Header />
        <div className='container' id='category-barters'>
          <div className='list'>
            <div className='list-item'>
              <h2>{categoryName}</h2>
            </div>
          </div>
          <ProductsGrid
            products={products}
          />
        </div>
      </div>
    );
  }
};

export default CategoryPage;