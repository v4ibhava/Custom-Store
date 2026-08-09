import axios from 'axios';

const api = axios.create({
  baseURL: ''
});

export const getAuthHeader = (token) => {
  return token ? { headers: { Authorization: token } } : {};
};

export default api;
