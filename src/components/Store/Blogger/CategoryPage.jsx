import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import PreloaderPage from '../../Preloader/PreloaderPage';
import Header from '../../Header/Header';
import Heading1 from '../../Barters/Heading/Heading1';
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
    return <PreloaderPage text='Загрузка данных категории...' />
  } else if (errorMessage) {
    return <PreloaderPage title='Ошибка' text={errorMessage} />
  } else {
    return (
      <div className='content-wrapper'>
        <Header />
        <div className='container' id='category-barters'>
          <Heading1 title={categoryName} />
          <ProductsGrid
            products={products}
          />
        </div>
      </div>
    );
  }
};

export default CategoryPage;