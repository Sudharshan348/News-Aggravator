import { formatDate } from '../utils/formatDate';

const NewsCard = ({ article }) => {
  const {
    title,
    source,
    publishedAt,
    url,
    content,
    urlToImage
  } = article;

  const handleReadMore = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      {urlToImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={urlToImage} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-3 mb-3 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
              {source}
            </span>
            <span className="font-medium">
              {formatDate(publishedAt)}
            </span>
          </div>
        </div>
        
        {content && (
          <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
            {content.length > 150 
              ? `${content.substring(0, 150)}...` 
              : content
            }
          </p>
        )}
        
        <button 
          onClick={handleReadMore}
          className="w-full btn-primary group-hover:bg-primary-600 flex items-center justify-center space-x-2"
        >
          <span>Read Full Article</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NewsCard;