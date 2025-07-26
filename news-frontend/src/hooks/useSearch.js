import { useState, useCallback, useMemo } from 'react';
import { newsAPI } from '../services/api';
import { debounce } from '../utils/helpers';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({
    q: '',
    from: '',
    to: '',
    source: '',
    category: '',
    sortBy: 'publishedAt',
    language: 'en'
  });

  const searchNews = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter out empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value && value.trim() !== '')
      );
      
      const results = await newsAPI.searchNews(cleanParams);
      setSearchResults(results || []);
      setSearchParams(params);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search news. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search for auto-suggestions
  const debouncedSearch = useMemo(
    () => debounce(searchNews, 500),
    [searchNews]
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchParams({
      q: '',
      from: '',
      to: '',
      source: '',
      category: '',
      sortBy: 'publishedAt',
      language: 'en'
    });
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    hasSearched,
    searchParams,
    searchNews,
    debouncedSearch,
    clearSearch,
    setSearchParams
  };
};