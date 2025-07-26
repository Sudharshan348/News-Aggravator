import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SavedNews = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  const fetchSavedNews = async () => {
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
  };

  useEffect(() => {
    fetchSavedNews();
  }, []);

  const sortedArticles = [...savedArticles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
      case 'oldest':
        return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'source':
        return (a.source || '').localeCompare(b.source || '');
      default:
        return 0;
    }
  });

  const handleRefresh = () => {
    fetchSavedNews();
  };

  if (loading) {
    return <LoadingSpinner message="Loading saved articles..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-200 max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-4">{error}</h2>
          <button 
            onClick={handleRefresh}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Saved Articles</h2>
            <p className="text-gray-600">Your curated collection of news articles</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="btn-success flex items-center space-x-2"
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {savedArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved articles yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Articles you save will appear here. Start by browsing headlines or searching for news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/" 
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span>Browse Headlines</span>
              </a>
              <a 
                href="/search" 
                className="btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search News</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Control Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{savedArticles.length}</span> saved articles
                </span>
                
                <div className="flex items-center space-x-3">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="source">Source A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article, index) => (
                <NewsCard 
                  key={`saved-${article._id || article.url}-${index}`} 
                  article={article} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedNews;