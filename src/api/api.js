import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
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
    const response = await apiClient.post('/login', data);
    sessionStorage.setItem('accessToken', response.data.accessToken);
}

const getUser = async (userId) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
}

const updateUser = async (userId, data) => {
    const response = await apiClient.post(`/user/${userId}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    });
    return response.data;
}

const updateRole = async (userId, role) => {
    const data = {
        'id': userId,
        'role': role
    }
    const response = await apiClient.post(`/user`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    });
    return response.data;
}

const setApi = async (userId, api) => {
    const data = {'api': api}
    const response = await apiClient.post(`/user/api/${userId}`, data);
    return response.data;
}

const cancelSellerSubscription = async (userId) => {
    const response = await apiClient.get(`/user/subscription/cancel/${userId}`);
    return response.data;
}

const getProductsByUserId = async (userId) => {
    const response = await apiClient.get(`/products/${userId}`);
    return response.data;
}

const deletProductsByUserId = async (userId) => {
    const response = await apiClient.delete(`/products/${userId}`);
    return response.data;
}

const getBartersNewByUserId = async (userId) => {
    const response = await apiClient.get(`/barters/new/${userId}`);
    return response.data;
}

const getBartersCurrentByUserId = async (userId) => {
    const response = await apiClient.get(`/barters/current/${userId}`);
    return response.data;
}

export default {
    generateAuthToken,
    getUser,
    updateUser,
    updateRole,
    setApi,
    cancelSellerSubscription,
    getProductsByUserId,
    deletProductsByUserId,
    getBartersNewByUserId,
    getBartersCurrentByUserId,
}