import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
      <div className="container">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📰</span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              News Aggregator
            </h1>
          </Link>
          
          <nav className="flex space-x-1 md:space-x-2">
            <Link 
              to="/" 
              className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Headlines
            </Link>
            <Link 
              to="/search" 
              className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/search') 
                  ? 'bg-primary-100 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Search
            </Link>
            <Link 
              to="/saved" 
              className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/saved') 
                  ? 'bg-primary-100 text-primary-700 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              Saved
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;