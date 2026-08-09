import api, { getAuthHeader } from './api';

export const couponService = {
  getCoupons: async () => {
    const res = await api.get('/api/coupons');
    return res.data;
  },

  createCoupon: async (couponData, token) => {
    const res = await api.post('/api/coupons', couponData, getAuthHeader(token));
    return res.data;
  },

  updateCoupon: async (id, couponData, token) => {
    const res = await api.put(`/api/coupons/${id}`, couponData, getAuthHeader(token));
    return res.data;
  },

  deleteCoupon: async (id, token) => {
    const res = await api.delete(`/api/coupons/${id}`, getAuthHeader(token));
    return res.data;
  }
};
