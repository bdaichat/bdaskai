import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { fetchCricketScores } from '@/services/cricketService';
import { fetchFootballScores } from '@/services/footballService';

/**
 * Score Card Component
 */
const ScoreCard = ({ match, type }) => {
  const isLive = match.isLive;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl"
    >
      {/* League & Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          {match.league}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500/20 text-green-600'
        }`}>
          {match.status}
        </span>
      </div>
      
      {/* Teams */}
      <h4 className="font-medium text-foreground bangla-body mb-2">
        {match.teams}
      </h4>
      
      {/* Score */}
      <p className={`text-lg font-bold ${type === 'football' ? 'text-2xl text-center' : ''} ${
        isLive ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {type === 'football' 
          ? `${match.homeScore} - ${match.awayScore}`
          : match.score
        }
      </p>
    </motion.div>
  );
};

/**
 * Sports Tab Component - Cricket and Football Scores
 */
export const SportsTab = () => {
  const [cricketScores, setCricketScores] = useState([]);
  const [footballScores, setFootballScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('cricket');
  
  const loadScores = async () => {
    setIsLoading(true);
    try {
      const [cricket, football] = await Promise.all([
        fetchCricketScores(),
        fetchFootballScores()
      ]);
      setCricketScores(cricket);
      setFootballScores(football);
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadScores();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadScores, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="sports-tab">
      {/* Sub-tab Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveSubTab('cricket')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all bangla-body ${
            activeSubTab === 'cricket'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'glass-panel hover:bg-card/80'
          }`}
          data-testid="cricket-tab-btn"
        >
          🏏 ক্রিকেট
        </button>
        <button
          onClick={() => setActiveSubTab('football')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all bangla-body ${
            activeSubTab === 'football'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'glass-panel hover:bg-card/80'
          }`}
          data-testid="football-tab-btn"
        >
          ⚽ ফুটবল
        </button>
      </div>
      
      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground bangla-heading">
          {activeSubTab === 'cricket' ? 'লাইভ ক্রিকেট স্কোর' : 'লাইভ ফুটবল স্কোর'}
        </h3>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={loadScores}
          disabled={isLoading}
          className="p-2 rounded-lg glass-panel hover:bg-card/80 transition-colors"
          data-testid="refresh-scores-btn"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
      
      {/* Scores Grid */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {activeSubTab === 'cricket' ? (
            cricketScores.length > 0 ? (
              cricketScores.map((match) => (
                <ScoreCard key={match.id} match={match} type="cricket" />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bangla-body">
                কোনো ম্যাচ পাওয়া যায়নি
              </div>
            )
          ) : (
            footballScores.length > 0 ? (
              footballScores.map((match) => (
                <ScoreCard key={match.id} match={match} type="football" />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bangla-body">
                কোনো ম্যাচ পাওয়া যায়নি
              </div>
            )
          )}
        </div>
      )}
      
      {/* Info Note */}
      <p className="text-xs text-center text-muted-foreground mt-4 bangla-body">
        স্কোর প্রতি ৩০ সেকেন্ডে আপডেট হয়
      </p>
    </div>
  );
};

export default SportsTab;
