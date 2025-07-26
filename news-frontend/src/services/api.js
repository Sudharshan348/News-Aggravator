import axios from 'axios';
const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const newsAPI = {
  fetchHeadlines: async () => {
    try {
      const response = await api.get('/news/headlines');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch headlines');
    }
  },
  getSavedNews: async () => {
    try {
      const response = await api.get('/saved');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get saved news');
    }
  },
  searchNews: async (params) => {
    try {
      const response = await api.get('/search', { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search news');
    }
  },
};

export default api;