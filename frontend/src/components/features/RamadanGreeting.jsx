import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Star, Sparkles, X } from 'lucide-react';

/**
 * RamadanGreeting Component - Integrated for BdAsk
 * Auto-detects Ramadan period and displays greetings
 */

const RamadanGreeting = ({ type = 'banner', onClose }) => {
  const [isRamadan, setIsRamadan] = useState(false);
  const [ramadanDay, setRamadanDay] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Ramadan 2025 dates
  const RAMADAN_START = new Date('2025-03-01');
  const RAMADAN_END = new Date('2025-03-30');

  useEffect(() => {
    checkRamadanStatus();
  }, []);

  const checkRamadanStatus = () => {
    const now = new Date();
    // For testing, always show
    // In production: const inRamadan = now >= RAMADAN_START && now <= RAMADAN_END;
    const inRamadan = true;
    setIsRamadan(inRamadan);

    if (inRamadan) {
      const daysDiff = Math.floor((now - RAMADAN_START) / (1000 * 60 * 60 * 24)) + 1;
      setRamadanDay(Math.min(Math.max(daysDiff, 1), 30));
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit =>
      digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit)] : digit
    ).join('');
  };

  if (!isRamadan || !isVisible) return null;

  // Banner Type
  if (type === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 p-4 mb-4"
        data-testid="ramadan-banner"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-6 h-6 text-white animate-pulse" />
            <div className="text-white">
              <span className="font-bold text-lg bangla-heading">রমজান মুবারক! 🌙</span>
              <span className="ml-3 text-sm opacity-90 bangla-body">
                রমজানের {toBengaliNumber(ramadanDay)} দিন
              </span>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Decorative stars */}
        <div className="absolute top-1 right-20 opacity-50">
          <Star className="w-3 h-3 text-yellow-300 animate-pulse" />
        </div>
        <div className="absolute bottom-1 right-32 opacity-40">
          <Sparkles className="w-4 h-4 text-yellow-200" />
        </div>
      </motion.div>
    );
  }

  // Card Type
  if (type === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-6 text-white text-center"
        data-testid="ramadan-card"
      >
        <div className="relative z-10">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-4"
          >
            <Moon className="w-12 h-12 mx-auto" />
          </motion.div>
          
          <h2 className="text-3xl font-bold bangla-display mb-2">রমজান মুবারক!</h2>
          <p className="text-lg opacity-90 bangla-body mb-4">
            রমজানের {toBengaliNumber(ramadanDay)} দিন
          </p>
          
          <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
            <p className="text-sm bangla-body leading-relaxed">
              "রমজান মাস, যে মাসে কুরআন নাযিল করা হয়েছে মানুষের হিদায়াতের জন্য"
            </p>
            <p className="text-xs mt-2 opacity-80 italic">- সূরা আল-বাকারা (২:১৮৫)</p>
          </div>
          
          <div className="flex flex-col gap-2 text-left">
            <p className="text-sm bangla-body">✨ ইফতার ও সেহরির সময় দেখুন</p>
            <p className="text-sm bangla-body">🕌 নামাজের সময় জানুন</p>
            <p className="text-sm bangla-body">💰 যাকাত হিসাব করুন</p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-4 right-4 opacity-20">
          <Star className="w-8 h-8 text-yellow-300" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Sparkles className="w-10 h-10 text-yellow-200" />
        </div>
      </motion.div>
    );
  }

  // Modal Type
  if (type === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
          data-testid="ramadan-modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-8 text-white text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Stars animation */}
            <div className="flex justify-center gap-4 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                >
                  <Star className="w-5 h-5 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Moon className="w-20 h-20 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-4xl font-bold bangla-display mb-3">
              রমজান মুবারক! 🌙
            </h1>
            
            <p className="text-xl opacity-90 bangla-body mb-6">
              রমজানের {toBengaliNumber(ramadanDay)} দিন
            </p>

            <div className="p-5 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <p className="text-base bangla-body leading-relaxed mb-2">
                "যে ব্যক্তি ঈমান ও সওয়াবের আশায় রমজানে রোজা রাখে, 
                তার অতীতের সকল গুনাহ মাফ করে দেওয়া হয়"
              </p>
              <p className="text-sm opacity-80 italic">- সহীহ বুখারী</p>
            </div>

            <div className="p-4 rounded-xl bg-white/15 mb-6">
              <p className="text-lg mb-1" style={{ fontFamily: 'serif' }}>
                بَارَكَ اللَّهُ لَكَ فِي رَمَضَانَ
              </p>
              <p className="text-sm opacity-90 bangla-body">
                আল্লাহ আপনার রমজান বরকতময় করুন
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="px-8 py-3 rounded-full bg-white text-purple-600 font-bold text-lg bangla-body shadow-lg"
            >
              চালিয়ে যান
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline Type
  if (type === 'inline') {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
        data-testid="ramadan-inline"
      >
        <Moon className="w-4 h-4" />
        <span className="bangla-body">রমজান মুবারক! 🌙</span>
      </motion.span>
    );
  }

  return null;
};

export default RamadanGreeting;
