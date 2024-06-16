import axios from 'axios';
import { retrieveLaunchParams } from '@tma.js/sdk';

const baseUrl = 'https://api.reviewbybloggers.ru';
const { initDataRaw } = retrieveLaunchParams();

const telegramInitData = async () => {
  const headers = {
    headers: {
      Authorization: `tma ${initDataRaw}`,
    },
  };

  try {
    const response = await axios.post(baseUrl + '/telegram/init', {}, headers);
    console.log(response.data);
  } catch (error) {
    console.error('Error posting initData:', error);
  }
};

const apiClient = axios.create({
  baseURL: baseUrl
});

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.error) {
        error.message = error.response.error;
      } else if (error.response.data && error.response.data.error) {
        error.message = error.response.data.error;
        if (error.response.data.error.message) {
          error.message = error.response.data.error.message;
        }
      }
    }
    return Promise.reject(error);
  }
);

const generateAuthToken = async (userId) => {
  const data = { 'id': userId }
  const response = await apiClient.post('/user/token/generate', data);
  return response;
}

const verifyAuthToken = async () => {
  const response = await apiClient.get('/user/token/verify');
  return response;
}

const getUser = async () => {
  const response = await apiClient.get(`/user`);
  return response.data;
}

const getUserById = async (userId) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
}

const createUser = async (data) => {
  const response = await apiClient.post(`/user/create`, data);
  return response.data;
}

const upsertUser = async (data) => {
  const response = await apiClient.post(`/user/upsert`, data);
  return response.data;
}

const setApiWildberries = async (token) => {
  const data = { 'api': token }
  const response = await apiClient.post(`/user/api/wildberries/`, data);
  return response.data;
}

const addSellerSubscription = async (data) => {
  const response = await apiClient.post(`/user/subscription/add`, data);
  return response.data;
}

const cancelSellerSubscription = async () => {
  const response = await apiClient.get(`/user/subscription/cancel`);
  return response.data;
}

const getProductById = async (productId) => {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data;
}

const getProductsByUserId = async (userId) => {
  const response = await apiClient.get(`/products/user/${userId}`);
  return response.data;
}

const getProductsWithBartersByUserId = async (userId) => {
  const response = await apiClient.get(`/products/user/${userId}?barters=true`);
  return response.data;
}

const deletProductsByUserId = async (userId) => {
  const response = await apiClient.delete(`/products/user/${userId}`);
  return response.data;
}

const getBartersByUserId = async () => {
  const response = await apiClient.get(`/barters`);
  return response.data;
}

const getBarterById = async (barterId) => {
  const response = await apiClient.get(`/barters/${barterId}`);
  return response.data;
}

const getBartersByProductId = async (productId, marketplace = '') => {
  const query = marketplace ? `?marketplace=${marketplace}` : '';
  const response = await apiClient.get(`/barters/products/${productId}${query}`);
  return response.data;
}

const getBartersByProductIds = async (productIdsArray) => {
  const data = { 'data': productIdsArray };
  const response = await apiClient.post(`/barters/products`, data);
  return response.data;
}

const getBartersNewByUserId = async (userId) => {
  const response = await apiClient.get(`/barters/new/user/${userId}`);
  return response.data;
}

const getBartersCurrentByUserId = async (userId) => {
  const response = await apiClient.get(`/barters/current/user/${userId}`);
  return response.data;
}

const createBarter = async (data) => {
  const response = await apiClient.post(`/barters/create/one`, data);
  return response.data;
}

const createBarters = async (data) => {
  const response = await apiClient.post(`/barters/create/many`, data);
  return response.data;
}

const updateBarter = async (data) => {
  const response = await apiClient.post(`/barters/update/one/${data.id}`, data);
  return response.data;
}

const updateBarters = async (data) => {
  const response = await apiClient.post(`/barters/update/many`, data);
  return response.data;
}

const closeBarterById = async (barterId) => {
  const response = await apiClient.post(`/barters/close/one/${barterId}`, data);
  return response.data;
}

const closeBarters = async (data) => {
  const response = await apiClient.post(`/barters/close/many`, data);
  return response.data;
}

const deleteBarterById = async (barterId) => {
  const response = await apiClient.post(`/barters/delete/one/${barterId}`, data);
  return response.data;
}

const deleteBarters = async (data) => {
  const response = await apiClient.post(`/barters/delete/many`, data);
  return response.data;
}

const getBarterOfferById = async (offerId) => {
  const response = await apiClient.get(`/offers/${offerId}`);
  return response.data;
}

const countOffersInStatus = async (status) => {
  const query = !!status ? `?status=${status}` : '';
  const response = await apiClient.get(`/offers/count${query}`);
  return response.data;
}

const countOffersActive = async () => {
  const response = await apiClient.get(`/offers/count/active`);
  return response.data;
}

const getBarterOffersByCurrentBlogger = async (type, limit, offset) => {
  const queryParams = [];
  if (type) queryParams.push(`type=${type}`);
  if (limit) queryParams.push(`limit=${limit}`);
  if (offset) queryParams.push(`offset=${offset}`);
  const query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
  const response = await apiClient.get(`/offers/blogger${query}`);
  return response.data;
}

const getBarterOffersByBloggerId = async (userId) => {
  const response = await apiClient.get(`/offers/blogger/${userId}`);
  return response.data;
}

const getBarterOffersByCurrentSeller = async (type, limit, offset) => {
  const queryParams = [];
  if (type) queryParams.push(`type=${type}`);
  if (limit) queryParams.push(`limit=${limit}`);
  if (offset) queryParams.push(`offset=${offset}`);
  const query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
  const response = await apiClient.get(`/offers/seller${query}`);
  return response.data;
}

const getOffersByBarterId = async (barterId) => {
  const response = await apiClient.get(`/offers/barters/${barterId}`);
  return response.data;
}

const createBarterOffer = async (data) => {
  const response = await apiClient.post(`/offers/create/one`, data);
  return response.data;
}

const refuseBarterOffer = async (offerId, reason) => {
  const data = {reason: reason};
  const response = await apiClient.post(`/offers/refuse/${offerId}`, data);
  return response.data;
}

const updateBarterOffer = async (data) => {
  const response = await apiClient.post(`/offers/report`, data);
  return response.data;
}

const getMarketplace = async (marketplaceId) => {
  const response = await apiClient.get(`/categories/marketplace/${marketplaceId}`);
  return response.data;
}

const getCategory = async (categoryID) => {
  const response = await apiClient.get(`/categories/${categoryID}`);
  return response.data;
}

const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
}

const getCategoriesByIds = async (categoryIdsArray) => {
  const data = { 'data': categoryIdsArray };
  const response = await apiClient.post('/categories', data);
  return response.data;
}

const getSubCategory = async (subCategoryID) => {
  const response = await apiClient.get(`/categories/subcategories/${subCategoryID}`);
  return response.data;
}

const getSubCategories = async () => {
  const response = await apiClient.get('/categories/subcategories');
  return response.data;
}

const getSubCategoriesByIds = async (subCategoryIdsArray) => {
  const data = { 'data': subCategoryIdsArray };
  const response = await apiClient.post('/categories/subcategories', data);
  return response.data;
}

const setStore = async () => {
  const response = await apiClient.get('/store');
  return response.data;
}

const setCategoryPage = async (subCategoryID) => {
  const response = await apiClient.get(`/store/barters/${subCategoryID}`);
  return response.data;
}

const getYookassaPaymentStatus = async (paymentId) => {
  const response = await apiClient.get(`/payment/subscription/status/${paymentId}`);
  return response.data;
}

const getYookassaConfirmationToken = async (period) => {
  const queryParams = [];
  if (period) queryParams.push(`period=${period}`);
  const query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
  console.log(period)
  console.log(query)
  const response = await apiClient.get(`/payment/subscription/yookassa/token${query}`);
  return response.data;
}

const createYookassaPayload = async (data) => {
  const response = await apiClient.post('/payment/subscription/yookassa/payload', data);
  return response.data;
}

const sendSupportMessage = async (data) => {
  const response = await apiClient.post(`/other/support`, data);
  return response.data;
}

const uploadImage = async (data) => {
  const response = await apiClient.post(`/storage/upload/image`, data, {headers: {'Content-Type': 'multipart/form-data'}});
  return response.data;
}

const uploadReceipt = async (barterId, data) => {
  const response = await apiClient.post(`/storage/barters/${barterId}/receipt`, data, {headers: {'Content-Type': 'multipart/form-data'}});
  return response.data;
}

const uploadBarterScreenshot = async (barterId, data) => {
  const response = await apiClient.post(`/storage/barters/${barterId}/screenshot`, data, {headers: {'Content-Type': 'multipart/form-data'}});
  return response.data;
}

export default {
  telegramInitData,

  generateAuthToken,
  verifyAuthToken,
  getUser,
  getUserById,
  createUser,
  upsertUser,
  setApiWildberries,
  addSellerSubscription,
  cancelSellerSubscription,

  getProductById,
  getProductsByUserId,
  getProductsWithBartersByUserId,
  deletProductsByUserId,

  getBartersByUserId,
  getBarterById,
  getBartersByProductId,
  getBartersByProductIds,
  getBartersNewByUserId,
  getBartersCurrentByUserId,
  createBarter,
  createBarters,
  updateBarter,
  updateBarters,
  closeBarterById,
  closeBarters,
  deleteBarterById,
  deleteBarters,
  
  getBarterOfferById,
  countOffersInStatus,
  countOffersActive,
  getBarterOffersByCurrentBlogger,
  getBarterOffersByBloggerId,
  getBarterOffersByCurrentSeller,
  getOffersByBarterId,
  createBarterOffer,
  refuseBarterOffer,
  updateBarterOffer,

  getMarketplace,

  getCategory,
  getCategories,
  getCategoriesByIds,
  getSubCategory,
  getSubCategories,
  getSubCategoriesByIds,

  setStore,
  setCategoryPage,

  getYookassaPaymentStatus,
  getYookassaConfirmationToken,
  createYookassaPayload,
  sendSupportMessage,

  uploadImage,
  uploadReceipt,
  uploadBarterScreenshot,
}