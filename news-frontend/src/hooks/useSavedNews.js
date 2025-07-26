import { useState, useEffect, useCallback } from 'react';
import { newsAPI } from '../services/api';

export const useSavedNews = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const articles = await newsAPI.getSavedNews();
      setSavedArticles(articles || []);
    } catch (err) {
      setError('Failed to fetch saved articles. Please try again.');
      console.error('Error fetching saved news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSavedNews = useCallback(() => {
    fetchSavedNews();
  }, [fetchSavedNews]);

  useEffect(() => {
    fetchSavedNews();
  }, [fetchSavedNews]);

  return {
    savedArticles,
    loading,
    error,
    refreshSavedNews,
    fetchSavedNews
  };
};