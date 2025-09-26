import api from './api';

const orderApi = {
  createOrder: async (orderData) => {
    const response = await api.post('/api/v1/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/api/v1/orders/myorders');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/api/v1/orders');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/api/v1/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/v1/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export default orderApi;