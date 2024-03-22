// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './Store.css';
// import api from '../../api/api';
// import { useToastManager } from '../../hooks/useToast';
// import { useUserProfile } from '../../hooks/UserProfileContext';
// import Preloader from '../Preloader/Preloader';
// import Header from '../Header/Header';
// import Button from '../Button/Button';
// import Link from '../Button/Link';
// import ProductsGrid from './ProductsGrid';
// import PopupEditProducts from './PopupEditProducts';
// import PopupWriteTask from './PopupWriteTask';

// const StoreSeller = () => {
//     const { profile, loading } = useUserProfile();
//     const location = useLocation();
//     const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
//         placeholder: true,
//         nmid: `id-${index}`,
//     }));
//     const [products, setProducts] = useState(initialProductsPlaceholder);
//     const [productsIsLoading, setProductsIsLoading] = useState(true);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [selectedProducts, setSelectedProducts] = useState([]);
//     const [isPopupEditProductsVisible, setIsPopupEditProductsVisible] = useState(false);
//     const [isPopupWriteTaskVisible, setIsPopupWriteTaskVisible] = useState(false);

//     const { showToast, resetLoadingToast } = useToastManager();

//     useEffect(() => {
//         if (errorMessage) {
//             resetLoadingToast();
//             showToast(errorMessage, 'error');
//             resetLoadingToast();
//         }
//     }, [errorMessage, showToast]);

//     useEffect(() => {
//         if (location.state?.showPopupAfterBloggerOnboarding) {
//             console.log("Показываем попап");
//             console.log(location);
//         }
//     }, [location.state]);

//     useEffect(() => {
//         const fetchData = async () => {
//             setProductsIsLoading(true);
//             try {
//                 const fetchedProducts = await api.getProductsWithBartersByUserId(profile.id);
//                 if (Array.isArray(fetchedProducts)) {
//                     console.log(fetchedProducts)
//                     setProducts(fetchedProducts);
//                 } else {
//                     throw new Error('Неверный формат данных');
//                 }
//             } catch (error) {
//                 setProducts([]);
//                 setErrorMessage('Произошла ошибка при получении списка товаров');
//                 console.error(error.message);
//             } finally {
//                 setProductsIsLoading(false);
//             }
//         };

//         if (!loading && profile.id) {
//             fetchData();
//         }
//     }, [loading, profile.id]);

//     const toggleEdit = () => {
//         setIsEditing(!isEditing);
//         if (isEditing) {
//             setSelectedProducts([]);
//         }
//     }

//     const handleSelectProduct = (productId) => {
//         setSelectedProducts((prevSelected) =>
//             prevSelected.includes(productId)
//                 ? prevSelected.filter((id) => id !== productId)
//                 : [...prevSelected, productId]
//         );
//     }

//     const openPopupEditProducts = () => {
//         if (selectedProducts.length > 0) setIsPopupEditProductsVisible(true);
//     }

//     const openPopupWriteTask = () => {
//         setIsPopupEditProductsVisible(false);
//         setIsPopupWriteTaskVisible(true);
//     }

//     if (loading || productsIsLoading) {
//         return <Preloader>Загружаюсь...</Preloader>;
//     }

//     return (
//         <div className='content-wrapper'>
//             <Header />
//             <div className='container' id='products'>
//                 <div className='list'>
//                     <div className='list-item'>
//                         <h2>Мои товары</h2>
//                         {products.length > 0 && <Link onClick={toggleEdit}>{isEditing ? 'Отменить' : 'Редактировать'}</Link>}
//                     </div>
//                 </div>
//                 <ProductsGrid
//                     products={products}
//                     isEditing={isEditing}
//                     selectedProducts={selectedProducts}
//                     handleSelectProduct={handleSelectProduct}
//                 />
//                 {isEditing && <Button onClick={openPopupEditProducts} className={selectedProducts.length > 0 ? 'sticky b-s shadow' : 'relative b-0 disabled'} icon='edit'>Редактировать</Button>}
//             </div>
//             <PopupEditProducts
//                 isOpen={isPopupEditProductsVisible}
//                 onClose={() => setIsPopupEditProductsVisible(false)}
//                 onWriteTask={openPopupWriteTask}
//             />
//             <PopupWriteTask
//                 isOpen={isPopupWriteTaskVisible}
//                 onClose={() => setIsPopupWriteTaskVisible(false)}
//             />
//         </div>
//     );
// };

// export default StoreSeller;




import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Store.css';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import { useUserProfile } from '../../hooks/UserProfileContext';
import { useHelpers } from '../../hooks/useHelpers';
import Header from '../Header/Header';
import Link from '../Button/Link';
import ProductsGrid from './ProductsGrid';

const StoreSeller = () => {
    const { profile, loading } = useUserProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast, resetLoadingToast } = useToastManager();
    const { getPlural } = useHelpers();

    const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
        placeholder: true,
        nmid: `id-${index}`,
    }));
    const [products, setProducts] = useState(initialProductsPlaceholder);
    const [productsIsLoading, setProductsIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [activeBarters, setActiveBarters] = useState([]);
    const [inactiveBarters, setInactiveBarters] = useState([]);

    useEffect(() => {
        if (errorMessage) {
            resetLoadingToast();
            showToast(errorMessage, 'error');
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
                        if (product.barter && !product.barter.closedat) {
                            active.push(product);
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
                setErrorMessage('Произошла ошибка при получении списка товаров');
                console.error(error.message);
            } finally {
                setProductsIsLoading(false);
            }
        };

        if (!loading && profile.id) {
            fetchData();
        }
    }, [loading, profile.id]);

    const openActiveProductsPage = () => {
        navigate('/store/products/active', { state: { products: activeBarters } });
    };

    const openInactiveProductsPage = () => {
        navigate('/store/products/inactive', { state: { products: inactiveBarters } });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            setSelectedProducts([]);
        }
    }

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    }

    return (
        <div className='content-wrapper'>
            <Header />
            {activeBarters.length > 0 && 
                <div className='container' id='products-active'>
                    <div className='list'>
                        <div className='list-item '>
                            <h2>Бартеры включены</h2>
                            <Link onClick={openActiveProductsPage}>Ещё</Link>
                        </div>
                        <div>
                            <small>Всего {activeBarters.length + ' ' + getPlural(activeBarters.length, 'товар', 'товара', 'товаров')} </small>
                        </div>
                    </div>
                    <ProductsGrid
                        products={activeBarters.slice(0, 2)}
                        isEditing={isEditing}
                        selectedProducts={selectedProducts}
                        handleSelectProduct={handleSelectProduct}
                    />
                </div>
            }
            {inactiveBarters.length > 0 && 
                <div className='container' id='products-inactive'>
                    <div className='list'>
                        <div className='list-item'>
                            <h2>Бартеры выключены</h2>
                            <Link onClick={openInactiveProductsPage}>Ещё</Link>
                        </div>
                        <div className='list-item'>
                            <small>Всего {inactiveBarters.length + ' ' + getPlural(inactiveBarters.length, 'товар', 'товара', 'товаров')} </small>
                        </div>
                    </div>
                    <ProductsGrid
                        products={inactiveBarters.slice(0, 2)}
                        isEditing={isEditing}
                        selectedProducts={selectedProducts}
                        handleSelectProduct={handleSelectProduct}
                    />
                </div>
            }
        </div>
    );
};

export default StoreSeller;
