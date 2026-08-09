import api, { getAuthHeader } from './api';

export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/api/category');
    return res.data;
  },

  createCategory: async (name, token) => {
    const res = await api.post('/api/category', { name }, getAuthHeader(token));
    return res.data;
  },

  updateCategory: async (id, name, token) => {
    const res = await api.put(`/api/category/${id}`, { name }, getAuthHeader(token));
    return res.data;
  },

  deleteCategory: async (id, token) => {
    const res = await api.delete(`/api/category/${id}`, getAuthHeader(token));
    return res.data;
  }
};
