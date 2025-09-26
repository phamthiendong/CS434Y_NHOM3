import api from './api';
const userApi = {
    login: async (credentials) => {
        const { data } = await api.post('/api/v1/auth/login', credentials);
        return data;
    },
    register: async (userData) => {
        const { data } = await api.post('/api/v1/auth/register', userData);
        return data;
    },

    getAllUsers: async () => {
        const { data } = await api.get('/api/v1/users');
        return data;
    },
};

export default userApi;