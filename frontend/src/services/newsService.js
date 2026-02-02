/**
 * News Service
 * Provides breaking news for Bangladesh
 */

// Demo news data
const DEMO_NEWS = [
  {
    id: 1,
    title: 'বাংলাদেশে নতুন অর্থনৈতিক সংস্কার ঘোষণা',
    titleEn: 'New economic reforms announced in Bangladesh',
    source: 'প্রথম আলো',
    time: '২ ঘণ্টা আগে',
    category: 'অর্থনীতি',
    categoryEn: 'Economy',
    image: null
  },
  {
    id: 2,
    title: 'ঢাকায় নতুন মেট্রো লাইনের উদ্বোধন',
    titleEn: 'New Metro line inaugurated in Dhaka',
    source: 'দৈনিক বাংলা',
    time: '৫ ঘণ্টা আগে',
    category: 'জাতীয়',
    categoryEn: 'National',
    image: null
  },
  {
    id: 3,
    title: 'AI প্রযুক্তিতে বাংলাদেশের অগ্রগতি',
    titleEn: 'Bangladesh advances in AI technology',
    source: 'টেক নিউজ',
    time: '১ দিন আগে',
    category: 'প্রযুক্তি',
    categoryEn: 'Technology',
    image: null
  },
  {
    id: 4,
    title: 'জাতীয় ক্রিকেট দলের সাফল্য উদযাপন',
    titleEn: 'National cricket team celebrates victory',
    source: 'খেলাধুলা',
    time: '৩ ঘণ্টা আগে',
    category: 'খেলা',
    categoryEn: 'Sports',
    image: null
  },
  {
    id: 5,
    title: 'চলচ্চিত্র উৎসবে বাংলাদেশি ছবির জয়জয়কার',
    titleEn: 'Bangladeshi film wins at film festival',
    source: 'বিনোদন বার্তা',
    time: '৬ ঘণ্টা আগে',
    category: 'বিনোদন',
    categoryEn: 'Entertainment',
    image: null
  }
];

// News categories
export const NEWS_CATEGORIES = [
  { id: 'all', name: 'সব', nameEn: 'All' },
  { id: 'national', name: 'জাতীয়', nameEn: 'National' },
  { id: 'international', name: 'আন্তর্জাতিক', nameEn: 'International' },
  { id: 'economy', name: 'অর্থনীতি', nameEn: 'Economy' },
  { id: 'sports', name: 'খেলা', nameEn: 'Sports' },
  { id: 'technology', name: 'প্রযুক্তি', nameEn: 'Technology' },
  { id: 'entertainment', name: 'বিনোদন', nameEn: 'Entertainment' }
];

/**
 * Fetch news articles
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of news articles
 */
export const fetchNews = async (category = 'all') => {
  try {
    // For now, return demo data
    // In production, integrate with NewsData.io or similar API
    if (category === 'all') {
      return DEMO_NEWS;
    }
    return DEMO_NEWS.filter(
      news => news.categoryEn.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('News API Error:', error);
    return DEMO_NEWS;
  }
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    'অর্থনীতি': 'bg-emerald-500',
    'জাতীয়': 'bg-blue-500',
    'আন্তর্জাতিক': 'bg-purple-500',
    'প্রযুক্তি': 'bg-cyan-500',
    'খেলা': 'bg-orange-500',
    'বিনোদন': 'bg-pink-500'
  };
  return colors[category] || 'bg-gray-500';
};

export default { fetchNews, NEWS_CATEGORIES, getCategoryColor };
