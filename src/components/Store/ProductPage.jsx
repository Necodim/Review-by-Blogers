import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Store.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import api from '../../api/api';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useToastManager } from '../../hooks/useToast'
import { useHelpers } from '../../hooks/useHelpers';
import Header from '../Header/Header';
import Input from '../Form/Input';
import Button from '../Button/Button';
import ProductPageSellerActions from './Seller/ProductPageSellerActions';
import ProductPageBloggerActions from './Blogger/ProductPageBloggerActions';
import PreloaderPage from '../Preloader/PreloaderPage';

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const { productId } = useParams();

  const { role } = useUserProfile();
  const { showToast } = useToastManager();
  const { getPlural, copyToClipboard, getMarketplaceShortName, getMarketplaceProductLink } = useHelpers();

  const [userRole, setUserRole] = useState(null);
  const [productData, setProductData] = useState(product);
  const [productLink, setProductLink] = useState('');
  const [marketplaceShortName, setMarketplaceShortName] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([product]);

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
      setErrorMessage('');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    setUserRole(role);
  }, [role]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productData) {
        setLoadingProduct(true);
        try {
          const fetchedProduct = await api.getProductById(productId);
          // const fetchedBarter = await api.getBartersByProductId(productId);
          // fetchedProduct.barter = fetchedBarter;
          setProductData(fetchedProduct);
          setSelectedProducts([fetchedProduct]);
          const short = await getMarketplaceShortName(fetchedProduct.marketplace_id);
          const link = await getMarketplaceProductLink(fetchedProduct.marketplace_id, fetchedProduct.nmid);
          setMarketplaceShortName(short);
          setProductLink(link);
        } catch (error) {
          setErrorMessage('Ошибка при получении данных о продукте');
        } finally {
          setLoadingProduct(false);
        }
      } else {
        const short = await getMarketplaceShortName(productData.marketplace_id);
        const link = await getMarketplaceProductLink(productData.marketplace_id, productData.nmid);
        setMarketplaceShortName(short);
        setProductLink(link);
      }
    }; 
    
    fetchProduct();
  }, [productId, productData]);

  if (loadingProduct) {
    return <PreloaderPage text='Загрузка данных о товаре...' />
  }

  if (!productData) {
    return <PreloaderPage title='Товар не найден' text='К сожалению, данный товар не найден. Попробуйте ещё раз.' />
  }

  const closeBarters = async () => {
    const idsToClose = selectedProducts.map(product => product.barter.id);
    const idsUnique = [...new Set(idsToClose)];
    const ids = idsUnique.filter(id => id !== null && id !== undefined);
    if (ids.length === 0) {
      setErrorMessage('У этих товаров нет открытых бартеров.');
      return;
    }

    const data = {ids: ids};
    
    try {
      const closedBarters = await api.closeBarters(data);
      const count = closedBarters.length;
      if (count > 0) {
        showToast(`${getPlural(count, 'Был закрыт', 'Было закрыто', 'Было закрыто')} ${count} ${getPlural(count, 'бартер', 'бартера', 'бартеров')}`, 'success');
      } else {
        showToast('Ни один бартер не был закрыт', 'info');
      }
			navigate('/store');
    } catch (error) {
      const message = 'Не удалось закрыть бартер(-ы)';
      setErrorMessage(message);
      console.error(message, error);
    }
  }

  const addBarter = () => {
    navigate('/barters/new/:productId', {state: {productId: productId}});
  }

  const handleCopy = () => {
    const result = copyToClipboard(productData?.nmid, 'Вы скопировали артикул товара', 'Не удалось скопировать артикул товара');
    showToast(result.message, result.status);
  }

  return (
    <div className='content-wrapper'>
      <Header />
      <div className='container product-page' id='product'>
        <div className='list'>
          <div className='list-item vartical'>
            {productData?.placeholder ? (
              <h1 className='product-title-h1'>Загрузка...</h1> 
            ) : (
              <h1 className='product-title-h1'>{productData?.title}</h1>
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
                  <img className='product-image' src={photo} alt={`${productData.title} (фото ${index + 1})`} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* <div
              className={`product-image ${productData?.photos && productData?.photos.length > 0 ? '' : productData?.placeholder ? 'loading' : 'default'}`}
              style={{ backgroundImage: productData?.photos && productData?.photos.length > 0 ? `url(${productData?.photos[0]})` : '' }}
            ></div> */}
          </div>
          <div className='list-item'>
            <Input id='product-nmid' name='product-nmid' value={productData?.nmid} readOnly fade={true} icon='content_copy' iconCallback={handleCopy} onClick={handleCopy} />
            <Button className='secondary w-auto size-input' icon='launch' onClick={() => window.open(productLink, '_blank')}>{marketplaceShortName}</Button>
          </div>
        </div>
        {userRole === 'seller' ? (
          <ProductPageSellerActions 
            selectedProducts={selectedProducts}
            closeBarters={closeBarters}
          />
        ) : userRole === 'blogger' ? (
          <ProductPageBloggerActions
            selectedProducts={selectedProducts}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProductPage;