import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Moon, Sun, MapPin, RefreshCw } from 'lucide-react';

/**
 * RamadanTiming Component - Integrated for BdAsk
 * Shows Iftar and Sehri times for Bangladesh cities during Ramadan
 */

const RamadanTiming = () => {
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeUntilIftar, setTimeUntilIftar] = useState('');
  const [isRamadan, setIsRamadan] = useState(true);

  // Ramadan 2025 dates (adjust based on moon sighting)
  const RAMADAN_START = new Date('2025-03-01');
  const RAMADAN_END = new Date('2025-03-30');

  // Iftar and Sehri times for major Bangladesh cities
  const cityTimings = {
    'Dhaka': { iftar: '18:15', sehri: '04:35', nameBn: 'ঢাকা' },
    'Chittagong': { iftar: '18:10', sehri: '04:30', nameBn: 'চট্টগ্রাম' },
    'Sylhet': { iftar: '18:05', sehri: '04:25', nameBn: 'সিলেট' },
    'Rajshahi': { iftar: '18:20', sehri: '04:40', nameBn: 'রাজশাহী' },
    'Khulna': { iftar: '18:18', sehri: '04:38', nameBn: 'খুলনা' },
    'Barishal': { iftar: '18:16', sehri: '04:36', nameBn: 'বরিশাল' },
    'Rangpur': { iftar: '18:22', sehri: '04:42', nameBn: 'রংপুর' },
    'Mymensingh': { iftar: '18:17', sehri: '04:37', nameBn: 'ময়মনসিংহ' }
  };

  const cities = Object.keys(cityTimings);

  useEffect(() => {
    const now = new Date();
    // For testing, always show Ramadan UI
    // In production: setIsRamadan(now >= RAMADAN_START && now <= RAMADAN_END);
    setIsRamadan(true);
  }, []);

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => 
      digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit)] : digit
    ).join('');
  };

  const calculateTimeUntilIftar = () => {
    const now = new Date();
    const timing = cityTimings[selectedCity];
    
    const [iftarHour, iftarMinute] = timing.iftar.split(':').map(Number);
    const iftarTime = new Date();
    iftarTime.setHours(iftarHour, iftarMinute, 0, 0);

    let diff = iftarTime - now;

    if (diff < 0) {
      setTimeUntilIftar('ইফতার হয়ে গেছে');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilIftar(`${toBengaliNumber(hours)} ঘন্টা ${toBengaliNumber(minutes)} মিনিট`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      calculateTimeUntilIftar();
    }, 60000);

    calculateTimeUntilIftar();
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const formatTimeBengali = (time) => {
    const [hour, minute] = time.split(':');
    return `${toBengaliNumber(hour)}:${toBengaliNumber(minute)}`;
  };

  const getRamadanDay = () => {
    const now = new Date();
    if (!isRamadan) return 0;
    const daysDiff = Math.floor((now - RAMADAN_START) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(daysDiff, 1), 30);
  };

  const timing = cityTimings[selectedCity];
  const ramadanDay = getRamadanDay();

  if (!isRamadan) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6" data-testid="ramadan-coming">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 rounded-2xl max-w-md"
        >
          <Moon className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-foreground bangla-heading mb-3">
            রমজান আসছে শীঘ্রই
          </h2>
          <p className="text-muted-foreground bangla-body">
            রমজান শুরু হবে: {RAMADAN_START.toLocaleDateString('bn-BD')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="ramadan-tab">
      {/* Ramadan Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      >
        <Moon className="w-10 h-10 mx-auto mb-3 animate-pulse" />
        <h1 className="text-2xl font-bold bangla-display mb-2">রমজান মুবারক 🌙</h1>
        <p className="text-lg opacity-90 bangla-body">রমজানের {toBengaliNumber(ramadanDay)} দিন</p>
      </motion.div>

      {/* City Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6"
      >
        <MapPin className="w-5 h-5 text-primary" />
        <select 
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="flex-1 glass-input"
          data-testid="ramadan-city-select"
        >
          {cities.map(city => (
            <option key={city} value={city}>{cityTimings[city].nameBn}</option>
          ))}
        </select>
      </motion.div>

      {/* Countdown Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center p-6 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white mb-6"
        data-testid="iftar-countdown"
      >
        <Clock className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-lg font-semibold bangla-heading mb-2">ইফতার পর্যন্ত</h2>
        <p className="text-3xl font-bold bangla-display">{timeUntilIftar}</p>
      </motion.div>

      {/* Timing Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Sehri Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 rounded-2xl text-center"
          data-testid="sehri-time"
        >
          <div className="icon-3d icon-3d-amber w-14 h-14 mx-auto mb-3">
            <Sun className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground bangla-heading mb-1">সেহরি</h3>
          <p className="text-2xl font-bold text-primary bangla-display">{formatTimeBengali(timing.sehri)}</p>
          <p className="text-sm text-muted-foreground bangla-body">ভোর</p>
        </motion.div>

        {/* Iftar Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl text-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
          data-testid="iftar-time"
        >
          <div className="icon-3d icon-3d-purple w-14 h-14 mx-auto mb-3">
            <Moon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold bangla-heading mb-1">ইফতার</h3>
          <p className="text-2xl font-bold bangla-display">{formatTimeBengali(timing.iftar)}</p>
          <p className="text-sm opacity-80 bangla-body">সন্ধ্যা</p>
        </motion.div>
      </div>

      {/* Tips Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 rounded-2xl mb-6"
      >
        <h3 className="text-lg font-semibold text-foreground bangla-heading mb-4">💡 রোজার টিপস</h3>
        <ul className="space-y-2">
          {['সেহরিতে প্রচুর পানি পান করুন', 'ইফতারে খেজুর দিয়ে শুরু করুন', 'তারাবীহ নামাজ আদায় করুন', 'কুরআন তিলাওয়াত করুন'].map((tip, index) => (
            <li key={index} className="flex items-center gap-2 p-2 rounded-lg glass-panel bangla-body text-foreground">
              <span className="text-primary">✓</span> {tip}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Quran Quote */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-white text-center"
      >
        <p className="text-base bangla-body mb-2 leading-relaxed">
          &ldquo;রমজান মাস, যে মাসে কুরআন নাযিল করা হয়েছে মানুষের হিদায়াতের জন্য&rdquo;
        </p>
        <p className="text-sm opacity-80 italic">- সূরা আল-বাকারা (২:১৮৫)</p>
      </motion.div>
    </div>
  );
};

export default RamadanTiming;
