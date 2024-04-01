import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Store.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast'
import Header from '../Header/Header';
import Input from '../Form/Input';
import Button from '../Button/Button';

const ProductPage = () => {
  const navigate = useNavigate();
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
        setLoadingProduct(true);
        try {
          const fetchedProduct = await api.getProduct(productId);
          const fetchedBarter = await api.getBartersByProductId(productId);
          fetchedProduct.barter = fetchedBarter;
          console.log(fetchedProduct)
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
    return <div>Загрузка данных о товаре...</div>;
  }

  if (!productData) {
    return <div>Товар не найден</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(productData?.nmid)
      .then(() => {
        showToast('Вы скопировали артикул товара', 'success');
      })
      .catch((error) => {
        setErrorMessage('Не удалось скопировать артикул товара');
      });
  }

  const addBarter = () => {
    navigate('/barters/new/:productId', {state: {productId: productId}});
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container product-page' id='product'>
        <div className='list'>
          <div className='list-item vartical'>
            {productData?.placeholder ? (
              <h1 className='product-title'>Загрузка...</h1>
            ) : (
              <h1 className='product-title'>{productData?.title}</h1>
            )}
          </div>
          <small>{productData?.brand}</small>
        </div>
        <div className='list'>
          <div className='list-item'>
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              autoplay={{ delay: 4500 }}
              effect={'fade'}
              loop={true}
              pagination={{ clickable: true, type: 'bullets', dynamicBullets: true, dynamicMainBullets: 2 }}
              speed={600}
            >
              {productData?.photos && productData?.photos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <img className='product-image' src={photo} alt={`Product ${index}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* <div
              className={`product-image ${productData?.photos && productData?.photos.length > 0 ? '' : productData?.placeholder ? 'loading' : 'default'}`}
              style={{ backgroundImage: productData?.photos && productData?.photos.length > 0 ? `url(${productData?.photos[0]})` : '' }}
            ></div> */}
          </div>
          <div className='list-item'>
            <Input id='product-nmid' name='product-nmid' value={productData?.nmid} readOnly fade='true' icon='content_copy' iconCallback={handleCopy} onClick={handleCopy} />
            <Button className='secondary w-auto' icon='launch' onClick={() => window.open(`https://www.wildberries.ru/catalog/${productData?.nmid}/detail.aspx`, '_blank')}>WB</Button>
          </div>
        </div>
        <div className='w-100'>
          {productData?.barter ?
            <Button icon='format_list_bulleted'>Смотреть ТЗ</Button> :
            <Button icon='add' onClick={addBarter}>Добавить бартер</Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductPage;