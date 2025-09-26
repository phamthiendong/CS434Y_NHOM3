import api from './api';

const categoryApi = {
    getAllCategories: async () => {
        try {
            const { data } = await api.get('/api/v1/categories');
            return data;
        } catch (error) {
            console.error("Lỗi khi gọi API lấy danh mục:", error.response || error.message);
            return [];
        }
    },
};

export default categoryApi;