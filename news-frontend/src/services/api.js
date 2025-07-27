import axios from 'axios';

const getApiBase = () => {
  if (process.env.NODE_ENV === 'production' || window.location.hostname.includes('vercel')) {
    return 'https://news-aggravator-production.up.railway.app/api';
  }
  return 'http://localhost:3000/api';
};

const API_BASE = getApiBase();
console.log('API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestHeaders: error.config?.headers,
      responseHeaders: error.response?.headers,
    });
    
    // More specific error handling
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - possible CORS or server unavailable');
    } else if (error.code === 'ERR_FAILED') {
      console.error('Request failed - server might be down');
    }
    
    return Promise.reject(error);
  }
);

export const newsAPI = {
  fetchHeadlines: async () => {
    try {
      console.log('Fetching headlines from:', `${API_BASE}/news/headlines`);
      
      // Test basic connectivity first
      try {
        await api.get('/');
        console.log('Health check passed');
      } catch (healthError) {
        console.error('Health check failed:', healthError.message);
        throw new Error('Backend server is not accessible');
      }
      
      const response = await api.get('/news/headlines');
      console.log('Headlines response:', response.data);
      
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
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        throw new Error('CORS or network error. Please check if the backend server is running and CORS is configured correctly.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_FAILED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch headlines');
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
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        throw new Error('CORS or network error. Please check if the backend server is running and CORS is configured correctly.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_FAILED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Failed to get saved news');
    }
  },

  searchNews: async (params) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          cleanParams[key] = value.toString().trim();
        }
      });
      
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
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        throw new Error('CORS or network error. Please check if the backend server is running and CORS is configured correctly.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_FAILED') {
        throw new Error('Unable to connect to news service. Please make sure the backend server is running.');
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Failed to search news');
    }
  }
};

export const checkAPIHealth = async () => {
  try {
    console.log('Checking API health at:', `${API_BASE}/`);
    const response = await api.get('/');
    console.log('Health check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error(`Backend service is not available: ${error.message}`);
  }
};

export default api;