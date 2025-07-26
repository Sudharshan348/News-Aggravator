import { useState } from 'react';
import { newsAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(searchParams.q);
      
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value.trim() !== '')
      );
      
      const results = await newsAPI.searchNews(cleanParams);
      setSearchResults(results || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search news. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Search News</h2>
          <p className="text-gray-600">Find articles by keywords, date range, and news sources</p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Loading State */}
        {loading && (
          <LoadingSpinner message={`Searching for "${currentQuery}"...`} />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Search Failed</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && hasSearched && (
          <>
            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try different keywords or adjust your search filters
                </p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Found <span className="font-semibold text-gray-900">{searchResults.length}</span> articles
                      {currentQuery && (
                        <span> for "<span className="font-medium text-primary-600">{currentQuery}</span>"</span>
                      )}
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Sorted by relevance</span>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((article, index) => (
                    <NewsCard 
                      key={`search-${article.url}-${index}`} 
                      article={article} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Initial State - Show when no search has been performed */}
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to search</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter your search terms above to find relevant news articles from various sources
            </p>
            
            {/* Quick Search Suggestions */}
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-3">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Technology', 'Politics', 'Sports', 'Health', 'Business'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch({ q: suggestion, from: '', to: '', source: '' })}
                    className="px-3 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;