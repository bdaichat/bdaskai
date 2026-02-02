import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { fetchNews, NEWS_CATEGORIES, getCategoryColor } from '@/services/newsService';

/**
 * News Card Component
 */
const NewsCard = ({ article, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="glass-card p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
    data-testid={`news-card-${article.id}`}
  >
    {/* Category Badge */}
    <div className="flex items-center justify-between mb-2">
      <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${getCategoryColor(article.category)}`}>
        {article.category}
      </span>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    
    {/* Title */}
    <h3 className="font-medium text-foreground bangla-body mb-2 line-clamp-2 group-hover:text-primary transition-colors">
      {article.title}
    </h3>
    
    {/* Meta */}
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{article.source}</span>
      <span>•</span>
      <span>{article.time}</span>
    </div>
  </motion.div>
);

/**
 * News Tab Component
 */
export const NewsTab = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const loadNews = async (category = 'all') => {
    setIsLoading(true);
    try {
      const articles = await fetchNews(category);
      setNews(articles);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadNews(selectedCategory);
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => loadNews(selectedCategory), 300000);
    return () => clearInterval(interval);
  }, [selectedCategory]);
  
  return (
    <div className="h-full flex flex-col p-4 overflow-hidden" data-testid="news-tab">
      {/* Category Filter */}
      <div className="chips-container mb-4 -mx-4 px-4">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`suggestion-chip whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground border-primary'
                : ''
            }`}
            data-testid={`category-${category.id}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground bangla-heading">
          📰 সর্বশেষ খবর
        </h3>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={() => loadNews(selectedCategory)}
          disabled={isLoading}
          className="p-2 rounded-lg glass-panel hover:bg-card/80 transition-colors"
          data-testid="refresh-news-btn"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
      
      {/* News List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        ) : news.length > 0 ? (
          news.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground bangla-body">
            কোনো খবর পাওয়া যায়নি
          </div>
        )}
      </div>
      
      {/* Info Note */}
      <p className="text-xs text-center text-muted-foreground mt-4 bangla-body">
        খবর প্রতি ৫ মিনিটে আপডেট হয়
      </p>
    </div>
  );
};

export default NewsTab;
