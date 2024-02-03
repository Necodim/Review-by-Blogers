import axios from 'axios';

const getUser = async (userId) => {
    const response = await axios.get(`http://localhost:3001/user/${userId}`);
    return response.data;
}

const updateRole = async (userId, role) => {
    const data = {
        'id': userId,
        'role': role
    }
    const response = await axios.post('http://localhost:3001/user', data, {
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    });
    return response.data;
}

const getCardsList = async (userId) => {
    const response = await axios.get(`http://localhost:3001/products/${userId}`);
    return response.data;
}

export default {
    getUser,
    updateRole,
    getCardsList
}

// const API_WB_BASE_URL = 'https://suppliers-api.wildberries.ru/content/v2/';

// const getCardsList = async (apiToken) => {
//     const PATH_METHOD = 'get/cards/list';
//     const PATH_LOCALE = '?locale=ru';

//     if (!apiToken) {
//         throw new Error('Вы не добавили API-ключ');
//     }

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Authorization': apiToken,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             'settings': {
//                 'cursor': {
//                     'limit': 1000
//                 },
//                 'filter': {
//                     'withPhoto': -1
//                 }
//             }
//         }),
//         redirect: 'follow'
//     };

//     try {
//         const url = API_WB_BASE_URL + PATH_METHOD + PATH_LOCALE;
//         const response = await fetch(url, requestOptions);
//         if (!response.ok) {
//             throw new Error('Не удалось загрузить бренды');
//         }
//         const data = await response.json();
//         return data.cards;
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         throw error;
//     }
// };

// export default getCardsList;