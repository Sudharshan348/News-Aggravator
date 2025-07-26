import { useState, useCallback, useMemo } from 'react';

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    category: '',
    source: '',
    sortBy: 'publishedAt',
    language: 'en',
    ...initialFilters
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      source: '',
      sortBy: 'publishedAt',
      language: 'en'
    });
  }, []);

  const toggleFilters = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => 
      value && value !== 'publishedAt' && value !== 'en'
    ).length;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    updateFilters,
    clearFilters,
    isFilterOpen,
    toggleFilters,
    setIsFilterOpen,
    activeFiltersCount,
    hasActiveFilters
  };
};