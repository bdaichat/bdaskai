import { motion } from "framer-motion";
import { 
  Newspaper, 
  BookOpen, 
  Lightbulb, 
  Heart,
  CloudSun,
  MessageCircle,
  Trophy,
  Globe2,
  DollarSign,
  Clock
} from "lucide-react";
import { Logo } from "@/components/Logo";

// Premium Starter Cards with 3D Icons
const STARTER_CARDS = [
  {
    id: "news",
    icon: Newspaper,
    title: "খবর",
    titleEn: "News",
    description: "আজকের গুরুত্বপূর্ণ খবর",
    prompt: "আজকের খবর কি?",
    iconClass: "icon-3d-rose"
  },
  {
    id: "sports",
    icon: Trophy,
    title: "খেলা",
    titleEn: "Sports",
    description: "ক্রিকেট ও ফুটবল স্কোর",
    prompt: "আজকের ক্রিকেট স্কোর কি?",
    iconClass: "icon-3d-orange"
  },
  {
    id: "weather",
    icon: CloudSun,
    title: "আবহাওয়া",
    titleEn: "Weather",
    description: "বাংলাদেশের আবহাওয়া",
    prompt: "ঢাকার আবহাওয়া কেমন?",
    iconClass: "icon-3d-cyan"
  },
  {
    id: "translate",
    icon: Globe2,
    title: "অনুবাদ",
    titleEn: "Translate",
    description: "বহুভাষিক অনুবাদ",
    prompt: "Hello কে বাংলায় অনুবাদ করুন",
    iconClass: "icon-3d-purple"
  }
];

// Quick Action Chips
const QUICK_ACTIONS = [
  { text: "কথা বলতে চাই", icon: MessageCircle },
  { text: "অনুপ্রাণিত করুন", icon: Heart },
  { text: "নতুন কিছু শিখতে চাই", icon: Lightbulb },
  { text: "একটি গল্প বলুন", icon: BookOpen },
];

/**
 * Premium 3D Starter Card Component
 */
const StarterCard = ({ card, onClick, index }) => {
  const Icon = card.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.3 + index * 0.1, 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(card.prompt)}
      className="starter-card group"
      data-testid={`starter-card-${card.id}`}
    >
      {/* 3D Icon Container */}
      <div className={`icon-3d ${card.iconClass} w-16 h-16 mb-4`}>
        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
      </div>
      
      {/* Title */}
      <h3 className="starter-card-title text-lg">
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
 * Feature Quick Access Icons with 3D Style
 */
const FeatureQuickAccess = () => {
  const features = [
    { icon: Trophy, label: "স্কোর", iconClass: "icon-3d-orange" },
    { icon: DollarSign, label: "মুদ্রা", iconClass: "icon-3d-green" },
    { icon: Clock, label: "নামাজ", iconClass: "icon-3d-amber" },
    { icon: Globe2, label: "অনুবাদ", iconClass: "icon-3d-purple" },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-center gap-8 mb-8"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className={`icon-3d ${feature.iconClass} w-12 h-12 mb-2`}>
              <Icon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xs text-muted-foreground bangla-body font-medium">
              {feature.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/**
 * Premium Welcome Screen Component
 */
export const WelcomeScreen = ({ onSuggestionClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto" data-testid="welcome-screen">
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Premium Logo with Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Logo size="xl" showText={false} animate={true} className="justify-center" />
        </motion.div>
        
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground bangla-display mb-3">
            স্বাগতম বিডিআস্কে!
          </h1>
          <p className="text-lg text-muted-foreground bangla-body mb-2">
            আমি আপনার বাংলাদেশী AI সহকারী
          </p>
          <p className="text-sm text-muted-foreground/80 bangla-body mb-8">
            বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন • 
            <span className="text-primary font-medium"> মাইক বাটনে ক্লিক করে কথাও বলতে পারেন!</span>
          </p>
        </motion.div>
        
        {/* Feature Quick Access with 3D Icons */}
        <FeatureQuickAccess />
        
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
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {QUICK_ACTIONS.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSuggestionClick(item.text)}
              className="suggestion-chip"
              data-testid={`quick-action-${index}`}
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
