import api, { getAuthHeader } from './api';

export const authService = {
  loginWithPassword: async (credentials) => {
    const res = await api.post('/user/loginWithPassword', credentials);
    return res.data;
  },

  signupOtp: async (email) => {
    const res = await api.post('/api/otp/signup', { email });
    return res.data;
  },

  loginOtp: async (email) => {
    const res = await api.post('/api/otp/login', { email });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await api.post('/api/otp/verify', { email, otp });
    return res.data;
  },

  getUserInfo: async (token) => {
    const res = await api.get('/user/information', getAuthHeader(token));
    return res.data;
  },

  refreshToken: async () => {
    const res = await api.get('/user/refreshtoken');
    return res.data;
  },

  logout: async () => {
    const res = await api.get('/user/logout');
    return res.data;
  },

  setupProfile: async (profileData, token) => {
    const res = await api.put('/user/setup-profile', profileData, getAuthHeader(token));
    return res.data;
  },

  saveCart: async (cart, token) => {
    const res = await api.put('/user/cart', { cart }, getAuthHeader(token));
    return res.data;
  },

  getCart: async (token) => {
    const res = await api.get('/user/cart', getAuthHeader(token));
    return res.data;
  },

  saveWishlist: async (wishlist, token) => {
    const res = await api.post('/user/wishlist', { wishlist }, getAuthHeader(token));
    return res.data;
  },

  getWishlist: async (token) => {
    const res = await api.get('/user/wishlist', getAuthHeader(token));
    return res.data;
  },

  getAddresses: async (token) => {
    const res = await api.get('/user/addresses', getAuthHeader(token));
    return res.data;
  },

  addAddress: async (addressData, token) => {
    const res = await api.post('/user/address', addressData, getAuthHeader(token));
    return res.data;
  },

  updateAddress: async (addressId, addressData, token) => {
    const res = await api.put(`/user/address/${addressId}`, addressData, getAuthHeader(token));
    return res.data;
  },

  deleteAddress: async (addressId, token) => {
    const res = await api.delete(`/user/address/${addressId}`, getAuthHeader(token));
    return res.data;
  }
};
