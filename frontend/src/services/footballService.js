/**
 * Football Score Service
 * Uses free football-data.org API
 */

// Demo data for when API is unavailable
const DEMO_FOOTBALL_SCORES = [
  {
    id: 1,
    teams: 'ম্যানচেস্টার ইউনাইটেড vs লিভারপুল',
    teamsEn: 'Manchester United vs Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'সম্পূর্ণ',
    statusEn: 'FT',
    league: 'প্রিমিয়ার লিগ',
    leagueEn: 'Premier League',
    minute: null,
    isLive: false
  },
  {
    id: 2,
    teams: 'রিয়াল মাদ্রিদ vs বার্সেলোনা',
    teamsEn: 'Real Madrid vs Barcelona',
    homeScore: 1,
    awayScore: 0,
    status: "৪৫' + ২",
    statusEn: "45' + 2",
    league: 'লা লিগা',
    leagueEn: 'La Liga',
    minute: 47,
    isLive: true
  },
  {
    id: 3,
    teams: 'বায়ার্ন মিউনিখ vs পিএসজি',
    teamsEn: 'Bayern Munich vs PSG',
    homeScore: 2,
    awayScore: 2,
    status: "৭৫'",
    statusEn: "75'",
    league: 'চ্যাম্পিয়ন্স লিগ',
    leagueEn: 'Champions League',
    minute: 75,
    isLive: true
  }
];

/**
 * Fetch live football scores
 * @returns {Promise<Array>} Array of football matches
 */
export const fetchFootballScores = async () => {
  try {
    // For now, return demo data
    // In production, integrate with actual API
    return DEMO_FOOTBALL_SCORES;
  } catch (error) {
    console.error('Football API Error:', error);
    return DEMO_FOOTBALL_SCORES;
  }
};

/**
 * Get match status color class
 */
export const getMatchStatusColor = (isLive) => {
  return isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500';
};

export default { fetchFootballScores, getMatchStatusColor };
