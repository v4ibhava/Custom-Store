import api, { getAuthHeader } from './api';

export const productService = {
  getProducts: async () => {
    const res = await api.get('/api/products');
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },

  createProduct: async (productData, token) => {
    const res = await api.post('/api/products', productData, getAuthHeader(token));
    return res.data;
  },

  updateProduct: async (id, productData, token) => {
    const res = await api.put(`/api/products/${id}`, productData, getAuthHeader(token));
    return res.data;
  },

  deleteProduct: async (id, token) => {
    const res = await api.delete(`/api/products/${id}`, getAuthHeader(token));
    return res.data;
  }
};
