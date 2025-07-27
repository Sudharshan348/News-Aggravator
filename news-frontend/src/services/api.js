import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.PROD) {
    return 'http://localhost:3000/api';
  }
  return 'http://localhost:3000/api';
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`, config.params || {});
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message
    });
    return Promise.reject(error);
  }
);

export const newsAPI = {
  fetchHeadlines: async () => {
    try {
      const response = await api.get('/news/headlines');
      if (response.data && response.data.data && response.data.data.articles) {
        return {
          ...response.data,
          data: {
            ...response.data.data,
            articles: response.data.data.articles.map(article => ({
              ...article,
              title: article.title || 'Untitled',
              source: article.source || 'Unknown Source',
              publishedAt: article.publishedAt || new Date().toISOString(),
              url: article.url || '#',
              urlToImage: article.urlToImage || null,
              content: article.content || article.description || ''
            }))
          }
        };
      }
      
      throw new Error('Invalid response format from headlines endpoint');
    } catch (error) {
      console.error('Headlines fetch error:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch headlines');
    }
  },

  getSavedNews: async () => {
    try {
      const response = await api.get('/saved');
      
      const articles = Array.isArray(response.data) ? response.data : [];
      
      return articles.map(article => ({
        ...article,
        title: article.title || 'Untitled',
        source: article.source || 'Unknown Source',
        publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
        url: article.url || '#',
        urlToImage: article.urlToImage || null,
        content: article.content || article.description || ''
      }));
    } catch (error) {
      console.error('Saved news fetch error:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      throw new Error(error.response?.data?.error || 'Failed to get saved news');
    }
  },

  searchNews: async (params) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          cleanParams[key] = value.toString().trim();
        }
      })
      console.log('Searching with params:', cleanParams);
      const response = await api.get('/search', { params: cleanParams });
      const articles = Array.isArray(response.data) ? response.data : [];
      return articles.map(article => ({
        ...article,
        title: article.title || 'Untitled',
        source: article.source || 'Unknown Source',
        publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
        url: article.url || '#',
        urlToImage: article.urlToImage || null,
        content: article.content || article.description || ''
      }));
    } catch (error) {
      console.error('Search error:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      throw new Error(error.response?.data?.error || 'Failed to search news');
    }
  }
};
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Backend service is not available');
  }
};

export default api;