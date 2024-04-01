import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './Store.css';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast'

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { productId } = useParams();

  const { showToast } = useToastManager();

  const [productData, setProductData] = useState(product);
  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productData) {
        console.log(productId)
        setLoadingProduct(true);
        try {
          const fetchedProduct = await api.getProduct(productId);
          setProductData(fetchedProduct);
        } catch (error) {
          setErrorMessage('Ошибка при получении данных о продукте');
        } finally {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [productId, productData]);

  if (loadingProduct) {
    return <div>Загрузка данных о продукте...</div>;
  }

  if (!productData) {
    return <div>Продукт не найден</div>;
  }

  // Рендеринг информации о продукте
  return (
    <div>
      <h1>{productData.title}</h1>
      {/* Отображение деталей продукта */}
    </div>
  );
};

export default ProductPage;