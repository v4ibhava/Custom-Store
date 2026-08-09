import api, { getAuthHeader } from './api';

export const orderService = {
  getPaymentConfig: async () => {
    const res = await api.get('/api/payment/config');
    return res.data;
  },

  createRazorpayOrder: async (orderPayload, token) => {
    const res = await api.post('/api/payment/order', orderPayload, getAuthHeader(token));
    return res.data;
  },

  verifyRazorpayPayment: async (paymentPayload, token) => {
    const res = await api.post('/api/payment/verify', paymentPayload, getAuthHeader(token));
    return res.data;
  },

  getMyOrders: async (token) => {
    const res = await api.get('/api/orders/my', getAuthHeader(token));
    return res.data;
  },

  getAllOrders: async (token) => {
    const res = await api.get('/api/orders', getAuthHeader(token));
    return res.data;
  },

  updateOrderStatus: async (orderId, status, token) => {
    const res = await api.patch(`/api/orders/${orderId}/status`, { status }, getAuthHeader(token));
    return res.data;
  }
};
