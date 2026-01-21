import { motion } from "framer-motion";
import { 
  Bot, 
  Sparkles, 
  Newspaper, 
  BookOpen, 
  Lightbulb, 
  Heart,
  CloudSun,
  MessageCircle
} from "lucide-react";

// Premium Starter Cards Data
const STARTER_CARDS = [
  {
    id: "news",
    icon: Newspaper,
    title: "খবর",
    titleEn: "News",
    description: "আজকের গুরুত্বপূর্ণ খবর জানুন",
    prompt: "আজকের খবর কি?",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "creative",
    icon: BookOpen,
    title: "সৃজনশীল",
    titleEn: "Creative",
    description: "গল্প, কবিতা বা লেখালেখি",
    prompt: "একটি সুন্দর গল্প লিখুন",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    id: "weather",
    icon: CloudSun,
    title: "আবহাওয়া",
    titleEn: "Weather",
    description: "বাংলাদেশের আবহাওয়া জানুন",
    prompt: "ঢাকার আবহাওয়া কেমন?",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "learn",
    icon: Lightbulb,
    title: "শিখুন",
    titleEn: "Learn",
    description: "নতুন কিছু জানতে চান?",
    prompt: "নতুন কিছু শিখতে চাই",
    gradient: "from-emerald-500 to-teal-500"
  }
];

/**
 * Premium Starter Card Component
 */
const StarterCard = ({ card, onClick, index }) => {
  const Icon = card.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.3 + index * 0.1, 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(card.prompt)}
      className="starter-card"
    >
      {/* Icon Container */}
      <div className={`starter-card-icon bg-gradient-to-br ${card.gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Title */}
      <h3 className="starter-card-title text-base">
        {card.title}
      </h3>
      
      {/* Description */}
      <p className="starter-card-description">
        {card.description}
      </p>
    </motion.button>
  );
};

/**
 * Premium Welcome Screen Component
 * Displays when no chat session is active
 */
export const WelcomeScreen = ({ onSuggestionClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Premium Logo with Glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.1, 
            type: 'spring', 
            stiffness: 200,
            damping: 15
          }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-accent opacity-50 blur-xl animate-pulse-soft" />
          
          {/* Icon container */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
            <Bot className="w-12 h-12 text-primary-foreground" />
          </div>
          
          {/* Sparkle decorations */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
        
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground bangla-display mb-3">
            স্বাগতম বিডিআস্কে!
          </h1>
          <p className="text-lg text-muted-foreground bangla-body mb-2">
            আমি আপনার বাংলাদেশী AI সহকারী
          </p>
          <p className="text-sm text-muted-foreground/80 bangla-body mb-10">
            বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন • 
            <span className="text-primary font-medium"> মাইক বাটনে ক্লিক করে কথাও বলতে পারেন!</span>
          </p>
        </motion.div>
        
        {/* Starter Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground mb-5 bangla-body">
            শুরু করতে একটি বিষয় বেছে নিন:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STARTER_CARDS.map((card, index) => (
              <StarterCard
                key={card.id}
                card={card}
                onClick={onSuggestionClick}
                index={index}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Additional Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { text: "কথা বলতে চাই", icon: MessageCircle },
            { text: "অনুপ্রাণিত করুন", icon: Heart },
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSuggestionClick(item.text)}
              className="suggestion-chip"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="bangla-body">{item.text}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
