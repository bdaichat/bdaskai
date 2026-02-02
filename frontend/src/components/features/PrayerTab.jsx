import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, Moon } from 'lucide-react';
import { fetchPrayerTimes, BD_CITIES, PRAYER_NAMES, getPrayerNameBn } from '@/services/prayerService';

/**
 * Prayer Time Item Component
 */
const PrayerTimeItem = ({ prayer, time, isNext, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center justify-between p-4 rounded-xl ${
      isNext 
        ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30' 
        : 'glass-panel'
    }`}
    data-testid={`prayer-time-${prayer.toLowerCase()}`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">
        {prayer === 'Fajr' ? '🌅' :
         prayer === 'Sunrise' ? '☀️' :
         prayer === 'Dhuhr' ? '🌞' :
         prayer === 'Asr' ? '🌤️' :
         prayer === 'Maghrib' ? '🌅' : '🌙'}
      </span>
      <div>
        <p className={`font-medium bangla-body ${isNext ? 'text-primary' : 'text-foreground'}`}>
          {getPrayerNameBn(prayer)}
        </p>
        {isNext && (
          <p className="text-xs text-primary bangla-body">পরবর্তী নামাজ</p>
        )}
      </div>
    </div>
    <p className={`text-lg font-semibold ${isNext ? 'text-primary' : 'text-foreground'}`}>
      {time}
    </p>
  </motion.div>
);

/**
 * Prayer Times Tab Component
 */
export const PrayerTab = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  
  const loadPrayerTimes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPrayerTimes(selectedCity);
      setPrayerTimes(data);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadPrayerTimes();
  }, [selectedCity]);
  
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="prayer-tab">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground bangla-heading">
            🕌 নামাজের সময়সূচী
          </h2>
          {prayerTimes && (
            <p className="text-xs text-muted-foreground bangla-body">
              {prayerTimes.hijriDate}
            </p>
          )}
        </div>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={loadPrayerTimes}
          disabled={isLoading}
          className="p-2 rounded-lg glass-panel hover:bg-card/80 transition-colors"
          data-testid="refresh-prayer-btn"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
      
      {/* City Selector */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="flex-1 glass-input text-sm"
          data-testid="city-select"
        >
          {BD_CITIES.map((city) => (
            <option key={city.id} value={city.nameEn}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Current Date */}
      {prayerTimes && (
        <div className="glass-card rounded-xl p-4 mb-4 text-center">
          <p className="text-lg font-semibold text-foreground bangla-body">
            {prayerTimes.city}
          </p>
          <p className="text-sm text-muted-foreground bangla-body">
            {prayerTimes.date}
          </p>
        </div>
      )}
      
      {/* Prayer Times List */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      ) : prayerTimes ? (
        <div className="space-y-2">
          {Object.entries(prayerTimes.timings).map(([prayer, time], index) => (
            <PrayerTimeItem
              key={prayer}
              prayer={prayer}
              time={time}
              isNext={prayer === prayerTimes.nextPrayer}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bangla-body">
          নামাজের সময় লোড করতে সমস্যা হয়েছে
        </div>
      )}
      
      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
      >
        <p className="text-sm text-foreground/80 bangla-body">
          🤲 আল্লাহর কাছে সুন্দর জীবনের জন্য দোয়া করুন
        </p>
      </motion.div>
    </div>
  );
};

export default PrayerTab;
