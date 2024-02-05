import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const getUser = async (userId) => {
    const response = await axios.get(`${backendUrl}/user/${userId}`);
    return response.data;
}

const updateRole = async (userId, role) => {
    const data = {
        'id': userId,
        'role': role
    }
    const response = await axios.post(`${backendUrl}/user`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    });
    return response.data;
}

const setApi = async (userId, api) => {
    const data = {'api': api}
    const response = await axios.post(`${backendUrl}/user/api/${userId}`, data);
    return response.data;
}

const getCardsList = async (userId) => {
    const response = await axios.get(`${backendUrl}/products/${userId}`);
    return response.data;
}

export default {
    getUser,
    updateRole,
    setApi,
    getCardsList
}