import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.reviewbybloggers.ru'
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

const generateAuthToken = async (userId) => {
  const data = { 'id': userId }
  const response = await apiClient.post('/user/login', data);
  sessionStorage.setItem('accessToken', response.data.accessToken);
}

const getUser = async (userId) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
}

const createUser = async (userId, data) => {
  const response = await apiClient.post(`/user/${userId}`, data);
  return response.data;
}

const upsertUser = async (userId, data) => {
  const response = await apiClient.post(`/user/${userId}`, data);
  return response.data;
}

const setApiWildberries = async (userId, api) => {
  const data = { 'api': api }
  const response = await apiClient.post(`/user/api/wildberries/${userId}`, data);
  return response.data;
}

const addSellerSubscription = async (userId, data) => {
  const response = await apiClient.post(`/user/subscription/add/${userId}`, data);
  return response.data;
}

const cancelSellerSubscription = async (userId) => {
  const response = await apiClient.get(`/user/subscription/cancel/${userId}`);
  return response.data;
}

const getProduct = async (productId) => {
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

const getBartersByProductId = async (productId, marketplace) => {
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
  const response = await apiClient.post(`/barters/new`, data);
  return response.data;
}

const updateBarterById = async (data) => {
  const response = await apiClient.post(`/barters/update/${data.id}`, data);
  return response.data;
}

const deleteBarterById = async (barterId, userId) => {
  const data = {userId: userId}
  const response = await apiClient.post(`/barters/delete/${barterId}`, data);
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

const createPaymentPayload = async (data) => {
  const response = await apiClient.post('/payment/create-payload', data);
  return response.data;
}

const getPaymentStatus = async (paymentId) => {
  const response = await apiClient.get(`/payment/status/${paymentId}`);
  return response.data;
}

const sendSupportMessage = async (data) => {
  const response = await apiClient.post(`/other/support`, data);
  return response.data;
}

export default {
  generateAuthToken,
  getUser,
  createUser,
  upsertUser,
  setApiWildberries,
  addSellerSubscription,
  cancelSellerSubscription,

  getProduct,
  getProductsByUserId,
  getProductsWithBartersByUserId,
  deletProductsByUserId,

  getBartersByProductId,
  getBartersByProductIds,
  getBartersNewByUserId,
  getBartersCurrentByUserId,
  createBarter,
  updateBarterById,
  deleteBarterById,

  getCategory,
  getCategories,
  getCategoriesByIds,
  getSubCategory,
  getSubCategories,
  getSubCategoriesByIds,

  setStore,
  setCategoryPage,

  createPaymentPayload,
  getPaymentStatus,
  sendSupportMessage,
}