import api, { getAuthHeader } from './api';

export const settingsService = {
  getSettings: async () => {
    const res = await api.get('/api/settings');
    return res.data;
  },

  updateSettings: async (settingsData, token) => {
    const res = await api.put('/api/settings', settingsData, getAuthHeader(token));
    return res.data;
  },

  getStorageStats: async (token) => {
    const res = await api.get('/api/storage-stats', getAuthHeader(token));
    return res.data;
  }
};

