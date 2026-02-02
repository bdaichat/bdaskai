import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

// ============================================
// CRICKET SCORES SERVICE
// ============================================
export const fetchCricketScores = async () => {
  try {
    // Using demo data - can be replaced with real API
    // Real API: CricketData.org (https://cricketdata.org/)
    const demoScores = [
      {
        id: 1,
        teams: 'Bangladesh vs India',
        teamA: 'Bangladesh',
        teamB: 'India',
        scoreA: '285/7',
        scoreB: '220/5',
        oversA: '50',
        oversB: '35.2',
        status: 'Live',
        statusBn: 'লাইভ',
        league: 'ODI Series',
        leagueBn: 'ওডিআই সিরিজ'
      },
      {
        id: 2,
        teams: 'Comilla Victorians vs Dhaka Dominators',
        teamA: 'Comilla Victorians',
        teamB: 'Dhaka Dominators',
        scoreA: '165/8',
        scoreB: '142/10',
        oversA: '20',
        oversB: '18.4',
        status: 'Completed',
        statusBn: 'সম্পন্ন',
        league: 'BPL 2026',
        leagueBn: 'বিপিএল ২০২৬'
      },
      {
        id: 3,
        teams: 'Rajshahi Royals vs Sylhet Strikers',
        teamA: 'Rajshahi Royals',
        teamB: 'Sylhet Strikers',
        scoreA: '178/4',
        scoreB: '—',
        oversA: '18.2',
        oversB: '—',
        status: 'Live',
        statusBn: 'লাইভ',
        league: 'BPL 2026',
        leagueBn: 'বিপিএল ২০২৬'
      }
    ];
    return demoScores;
  } catch (error) {
    console.error('Cricket API Error:', error);
    return [];
  }
};

// ============================================
// FOOTBALL SCORES SERVICE
// ============================================
export const fetchFootballScores = async () => {
  try {
    // Using demo data - can be replaced with Football-Data.org API
    const demoScores = [
      {
        id: 1,
        teams: 'Manchester United vs Liverpool',
        teamA: 'Man United',
        teamB: 'Liverpool',
        scoreA: 2,
        scoreB: 1,
        status: 'FT',
        statusBn: 'সম্পূর্ণ',
        league: 'Premier League',
        leagueBn: 'প্রিমিয়ার লিগ'
      },
      {
        id: 2,
        teams: 'Real Madrid vs Barcelona',
        teamA: 'Real Madrid',
        teamB: 'Barcelona',
        scoreA: 1,
        scoreB: 0,
        status: "45'+2",
        statusBn: "৪৫'+২",
        league: 'La Liga',
        leagueBn: 'লা লিগা',
        isLive: true
      },
      {
        id: 3,
        teams: 'Bayern Munich vs Dortmund',
        teamA: 'Bayern',
        teamB: 'Dortmund',
        scoreA: 3,
        scoreB: 2,
        status: '78\'',
        statusBn: '৭৮\'',
        league: 'Bundesliga',
        leagueBn: 'বুন্দেসলিগা',
        isLive: true
      }
    ];
    return demoScores;
  } catch (error) {
    console.error('Football API Error:', error);
    return [];
  }
};

// ============================================
// NEWS SERVICE
// ============================================
export const fetchNews = async (category = 'all') => {
  try {
    // Using demo data - can be replaced with NewsData.io API
    const demoNews = [
      {
        id: 1,
        title: 'বাংলাদেশে নতুন অর্থনৈতিক সংস্কার ঘোষণা',
        titleEn: 'New economic reforms announced in Bangladesh',
        source: 'প্রথম আলো',
        time: '২ ঘণ্টা আগে',
        category: 'অর্থনীতি',
        categoryEn: 'economy'
      },
      {
        id: 2,
        title: 'ঢাকায় নতুন মেট্রো লাইনের উদ্বোধন',
        titleEn: 'New metro line inaugurated in Dhaka',
        source: 'দৈনিক বাংলা',
        time: '৫ ঘণ্টা আগে',
        category: 'জাতীয়',
        categoryEn: 'national'
      },
      {
        id: 3,
        title: 'AI প্রযুক্তিতে বাংলাদেশের অগ্রগতি',
        titleEn: 'Bangladesh advances in AI technology',
        source: 'টেক নিউজ',
        time: '১ দিন আগে',
        category: 'প্রযুক্তি',
        categoryEn: 'tech'
      },
      {
        id: 4,
        title: 'বাংলাদেশ ক্রিকেট দলের নতুন কোচ নিয়োগ',
        titleEn: 'New coach appointed for Bangladesh cricket team',
        source: 'খেলার খবর',
        time: '৩ ঘণ্টা আগে',
        category: 'খেলা',
        categoryEn: 'sports'
      },
      {
        id: 5,
        title: 'রাজধানীতে তাপমাত্রা বৃদ্ধির পূর্বাভাস',
        titleEn: 'Temperature rise forecast in capital',
        source: 'আবহাওয়া বার্তা',
        time: '১ ঘণ্টা আগে',
        category: 'আবহাওয়া',
        categoryEn: 'weather'
      }
    ];
    
    if (category !== 'all') {
      return demoNews.filter(news => news.categoryEn === category);
    }
    return demoNews;
  } catch (error) {
    console.error('News API Error:', error);
    return [];
  }
};

// ============================================
// CURRENCY EXCHANGE SERVICE
// ============================================
export const fetchExchangeRates = async () => {
  try {
    // Using demo data - can be replaced with ExchangeRate-API
    const demoRates = {
      base: 'BDT',
      baseBn: 'টাকা',
      lastUpdated: new Date().toLocaleDateString('bn-BD'),
      rates: [
        { code: 'USD', name: 'US Dollar', nameBn: 'মার্কিন ডলার', rate: 110.50, symbol: '$' },
        { code: 'EUR', name: 'Euro', nameBn: 'ইউরো', rate: 119.75, symbol: '€' },
        { code: 'GBP', name: 'British Pound', nameBn: 'ব্রিটিশ পাউন্ড', rate: 139.25, symbol: '£' },
        { code: 'INR', name: 'Indian Rupee', nameBn: 'ভারতীয় রুপি', rate: 1.32, symbol: '₹' },
        { code: 'SAR', name: 'Saudi Riyal', nameBn: 'সৌদি রিয়াল', rate: 29.45, symbol: 'ر.س' },
        { code: 'AED', name: 'UAE Dirham', nameBn: 'দিরহাম', rate: 30.10, symbol: 'د.إ' }
      ]
    };
    return demoRates;
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    return null;
  }
};

// ============================================
// PRAYER TIMES SERVICE (Free - Aladhan API)
// ============================================
export const fetchPrayerTimes = async (city = 'Dhaka') => {
  try {
    // Using Aladhan API (FREE, no key required)
    const cityCoords = {
      Dhaka: { lat: 23.8103, lon: 90.4125, nameBn: 'ঢাকা' },
      Chittagong: { lat: 22.3569, lon: 91.7832, nameBn: 'চট্টগ্রাম' },
      Sylhet: { lat: 24.8949, lon: 91.8687, nameBn: 'সিলেট' },
      Rajshahi: { lat: 24.3745, lon: 88.6042, nameBn: 'রাজশাহী' },
      Khulna: { lat: 22.8456, lon: 89.5403, nameBn: 'খুলনা' }
    };
    
    const coords = cityCoords[city] || cityCoords.Dhaka;
    
    const response = await axios.get(
      `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lon}&method=1`
    );
    
    const timings = response.data.data.timings;
    const date = response.data.data.date;
    
    return {
      city: city,
      cityBn: coords.nameBn,
      date: date.readable,
      dateBn: new Date().toLocaleDateString('bn-BD', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      hijriDate: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
      timings: [
        { name: 'Fajr', nameBn: 'ফজর', time: timings.Fajr, icon: '🌅' },
        { name: 'Sunrise', nameBn: 'সূর্যোদয়', time: timings.Sunrise, icon: '☀️' },
        { name: 'Dhuhr', nameBn: 'যোহর', time: timings.Dhuhr, icon: '🌤️' },
        { name: 'Asr', nameBn: 'আসর', time: timings.Asr, icon: '🌇' },
        { name: 'Maghrib', nameBn: 'মাগরিব', time: timings.Maghrib, icon: '🌆' },
        { name: 'Isha', nameBn: 'এশা', time: timings.Isha, icon: '🌙' }
      ]
    };
  } catch (error) {
    console.error('Prayer Times API Error:', error);
    // Return demo data on error
    return {
      city: 'Dhaka',
      cityBn: 'ঢাকা',
      date: new Date().toLocaleDateString('en-US'),
      dateBn: new Date().toLocaleDateString('bn-BD'),
      hijriDate: '',
      timings: [
        { name: 'Fajr', nameBn: 'ফজর', time: '05:15', icon: '🌅' },
        { name: 'Sunrise', nameBn: 'সূর্যোদয়', time: '06:30', icon: '☀️' },
        { name: 'Dhuhr', nameBn: 'যোহর', time: '12:10', icon: '🌤️' },
        { name: 'Asr', nameBn: 'আসর', time: '16:25', icon: '🌇' },
        { name: 'Maghrib', nameBn: 'মাগরিব', time: '17:45', icon: '🌆' },
        { name: 'Isha', nameBn: 'এশা', time: '19:00', icon: '🌙' }
      ]
    };
  }
};

// ============================================
// TRANSLATION SERVICE
// ============================================
export const translateText = async (text, sourceLang, targetLang) => {
  try {
    // Demo translation - in production, use Google Translate API or LibreTranslate
    const demoTranslations = {
      'bn-en': {
        'আমি ভালো আছি': 'I am fine',
        'ধন্যবাদ': 'Thank you',
        'শুভ সকাল': 'Good morning',
        'কেমন আছেন': 'How are you',
        'বাংলাদেশ': 'Bangladesh'
      },
      'en-bn': {
        'Hello': 'হ্যালো',
        'Thank you': 'ধন্যবাদ',
        'Good morning': 'শুভ সকাল',
        'How are you': 'কেমন আছেন',
        'Bangladesh': 'বাংলাদেশ'
      }
    };
    
    const key = `${sourceLang}-${targetLang}`;
    return demoTranslations[key]?.[text] || `[${targetLang.toUpperCase()}] ${text}`;
  } catch (error) {
    console.error('Translation Error:', error);
    return 'অনুবাদে ত্রুটি হয়েছে';
  }
};

// Language options for translation
export const LANGUAGES = [
  { code: 'bn', name: 'বাংলা', nameEn: 'Bengali' },
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi' },
  { code: 'ur', name: 'اردو', nameEn: 'Urdu' },
  { code: 'ar', name: 'العربية', nameEn: 'Arabic' },
  { code: 'es', name: 'Español', nameEn: 'Spanish' },
  { code: 'fr', name: 'Français', nameEn: 'French' },
  { code: 'de', name: 'Deutsch', nameEn: 'German' },
  { code: 'zh', name: '中文', nameEn: 'Chinese' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese' },
  { code: 'ko', name: '한국어', nameEn: 'Korean' }
];

export default {
  fetchCricketScores,
  fetchFootballScores,
  fetchNews,
  fetchExchangeRates,
  fetchPrayerTimes,
  translateText,
  LANGUAGES
};
