import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsAPI.fetchHeadlines();
      
      if (response.data && response.data.articles) {
        setHeadlines(response.data.articles);
      }
      
      setLastFetch(new Date());
    } catch (err) {
      setError('Failed to fetch headlines. Please try again.');
      console.error('Error fetching headlines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const handleRefresh = () => {
    fetchHeadlines();
  };

  if (loading) {
    return <LoadingSpinner message="Fetching latest headlines..." />;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Headlines</h2>
            <p className="text-gray-600">Stay updated with the latest news from around the world</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {lastFetch && (
              <span className="text-sm text-gray-500">
                Last updated: {lastFetch.toLocaleTimeString()}
              </span>
            )}
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

        {/* News Grid */}
        {headlines.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No headlines available</h3>
            <p className="text-gray-500">Please try refreshing the page or check back later.</p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{headlines.length}</span> articles
                </span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Live</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {headlines.map((article, index) => (
                <NewsCard 
                  key={`${article.url}-${index}`} 
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

export default Home;