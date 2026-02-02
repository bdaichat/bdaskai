/**
 * Cricket Score Service
 * Uses free CricAPI for live cricket scores
 */

// Demo data for when API is unavailable
const DEMO_CRICKET_SCORES = [
  {
    id: 1,
    teams: 'বাংলাদেশ vs ভারত',
    teamsEn: 'Bangladesh vs India',
    score: 'BAN ২৮৫/৭ (৫০) - IND ২২০/৫ (৩৫.২)',
    status: 'লাইভ',
    statusEn: 'Live',
    league: 'ওডিআই সিরিজ',
    leagueEn: 'ODI Series',
    isLive: true
  },
  {
    id: 2,
    teams: 'কুমিল্লা ভিক্টরিয়ান্স vs ঢাকা ডমিনেটরস',
    teamsEn: 'Comilla Victorians vs Dhaka Dominators',
    score: 'CV ১৬৫/৮ (২০) - DD ১৪২/১০ (১৮.৪)',
    status: 'সম্পন্ন',
    statusEn: 'Completed',
    league: 'বিপিএল ২০২৬',
    leagueEn: 'BPL 2026',
    isLive: false
  },
  {
    id: 3,
    teams: 'রংপুর রাইডার্স vs সিলেট স্ট্রাইকার্স',
    teamsEn: 'Rangpur Riders vs Sylhet Strikers',
    score: 'RR ১৫২/৩ (১৫.২)',
    status: 'লাইভ',
    statusEn: 'Live',
    league: 'বিপিএল ২০২৬',
    leagueEn: 'BPL 2026',
    isLive: true
  }
];

/**
 * Fetch live cricket scores
 * @returns {Promise<Array>} Array of cricket matches
 */
export const fetchCricketScores = async () => {
  try {
    // For now, return demo data
    // In production, integrate with actual API
    return DEMO_CRICKET_SCORES;
  } catch (error) {
    console.error('Cricket API Error:', error);
    return DEMO_CRICKET_SCORES;
  }
};

/**
 * Get match status color class
 */
export const getMatchStatusColor = (isLive) => {
  return isLive ? 'bg-red-500' : 'bg-green-500';
};

export default { fetchCricketScores, getMatchStatusColor };
