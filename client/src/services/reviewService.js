import api, { getAuthHeader } from './api';

export const reviewService = {
  getReviews: async () => {
    const res = await api.get('/api/reviews');
    return res.data;
  },

  getProductReviews: async (productId) => {
    const res = await api.get(`/api/product_reviews/${productId}`);
    return res.data;
  },

  createReview: async (reviewData, token) => {
    const res = await api.post('/api/reviews', reviewData, getAuthHeader(token));
    return res.data;
  },

  deleteReview: async (id, token) => {
    const res = await api.delete(`/api/reviews/${id}`, getAuthHeader(token));
    return res.data;
  },

  replyReview: async (id, replyText, token) => {
    const res = await api.put(`/api/reviews/${id}`, { reply: replyText }, getAuthHeader(token));
    return res.data;
  }
};
