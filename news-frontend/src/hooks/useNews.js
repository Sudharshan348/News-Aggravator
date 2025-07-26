import { useState, useEffect, useCallback } from 'react';
import { newsAPI } from '../services/api';

export const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchHeadlines = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsAPI.fetchHeadlines();
      
      if (response.data && response.data.articles) {
        setArticles(response.data.articles);
      }
      
      setLastFetch(new Date());
    } catch (err) {
      setError('Failed to fetch headlines. Please try again.');
      console.error('Error fetching headlines:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNews = useCallback(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  useEffect(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  return {
    articles,
    loading,
    error,
    lastFetch,
    refreshNews,
    fetchHeadlines
  };
};