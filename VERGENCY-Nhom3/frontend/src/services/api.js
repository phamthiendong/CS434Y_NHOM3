import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: baseURL, 
   
});

api.interceptors.request.use(
    (config) => {
        const userInfoFromStorage = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfoFromStorage?.token) {
            config.headers.Authorization = `Bearer ${userInfoFromStorage.token}`;
        }
        
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;