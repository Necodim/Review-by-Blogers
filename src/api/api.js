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
    const data = {'id': userId}
    const response = await apiClient.post('/user/login', data);
    sessionStorage.setItem('accessToken', response.data.accessToken);
}

const getUser = async (userId) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
}

const updateUser = async (userId, data) => {
    const response = await apiClient.post(`/user/${userId}`, data);
    return response.data;
}

const setApi = async (userId, api) => {
    const data = {'api': api}
    const response = await apiClient.post(`/user/api/${userId}`, data);
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

const getProductsByUserId = async (userId) => {
    const response = await apiClient.get(`/user/products/${userId}`);
    return response.data;
}

const getProductsWithBartersByUserId = async (userId) => {
    const response = await apiClient.get(`/user/products/${userId}?barters=true`);
    return response.data;
}

const deletProductsByUserId = async (userId) => {
    const response = await apiClient.delete(`/user/products/${userId}`);
    return response.data;
}

const getBartersNewByUserId = async (userId) => {
    const response = await apiClient.get(`/user/barters/new/${userId}`);
    return response.data;
}

const getBartersCurrentByUserId = async (userId) => {
    const response = await apiClient.get(`/user/barters/current/${userId}`);
    return response.data;
}

const getBartersByProductIds = async (productIdsArray) => {
    const data = {'data': productIdsArray};
    const response = await apiClient.post(`/barters/products`, data);
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
    const data = {'data': categoryIdsArray};
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
    const data = {'data': subCategoryIdsArray};
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

const sendSupportMessage = async (data) => {
    const response = await apiClient.post(`/other/support`, data);
    return response.data;
}

export default {
    generateAuthToken,
    getUser,
    updateUser,
    setApi,
    addSellerSubscription,
    cancelSellerSubscription,
    getProductsByUserId,
    getProductsWithBartersByUserId,
    deletProductsByUserId,
    getBartersNewByUserId,
    getBartersCurrentByUserId,
    getBartersByProductIds,
    getCategory,
    getCategories,
    getCategoriesByIds,
    getSubCategory,
    getSubCategories,
    getSubCategoriesByIds,
    setStore,
    setCategoryPage,
    sendSupportMessage,
}