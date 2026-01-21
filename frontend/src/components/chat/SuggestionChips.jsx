import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  CloudSun,
  Globe,
  Calculator,
  Heart
} from "lucide-react";

// Bengali suggestion set
const BENGALI_SUGGESTIONS = [
  { icon: CloudSun, text: "ঢাকার আবহাওয়া কেমন?", category: "weather" },
  { icon: Newspaper, text: "আজকের খবর কি?", category: "news" },
  { icon: HelpCircle, text: "বাংলাদেশ সম্পর্কে বলুন", category: "knowledge" },
  { icon: BookOpen, text: "একটি গল্প লিখুন", category: "creative" },
  { icon: Lightbulb, text: "নতুন কিছু শিখতে চাই", category: "education" },
  { icon: Heart, text: "অনুপ্রাণিত করুন", category: "motivation" }
];

// English suggestion set
const ENGLISH_SUGGESTIONS = [
  { icon: CloudSun, text: "What's the weather in Dhaka?", category: "weather" },
  { icon: Newspaper, text: "Tell me today's news", category: "news" },
  { icon: Globe, text: "Facts about Bangladesh", category: "knowledge" },
  { icon: BookOpen, text: "Write me a story", category: "creative" },
  { icon: Calculator, text: "Help me learn something new", category: "education" },
  { icon: Heart, text: "Inspire me today", category: "motivation" }
];

/**
 * Detect if text is primarily Bengali
 */
const isBengaliText = (text) => {
  if (!text) return true; // Default to Bengali
  // Bengali Unicode range: \u0980-\u09FF
  const bengaliPattern = /[\u0980-\u09FF]/g;
  const bengaliMatches = (text.match(bengaliPattern) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return totalChars === 0 || bengaliMatches / totalChars > 0.3;
};

/**
 * Suggestion Chips Component
 * Displays context-aware suggestions based on last message language
 */
export const SuggestionChips = ({ 
  onSuggestionClick, 
  lastMessage, 
  isLoading,
  showAll = false,
  className = ""
}) => {
  // Determine which suggestions to show based on last message language
  const suggestions = useMemo(() => {
    const isBengali = isBengaliText(lastMessage);
    const allSuggestions = isBengali ? BENGALI_SUGGESTIONS : ENGLISH_SUGGESTIONS;
    return showAll ? allSuggestions : allSuggestions.slice(0, 4);
  }, [lastMessage, showAll]);

  const isBengali = isBengaliText(lastMessage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap gap-2 justify-center ${className}`}
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={`${suggestion.category}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSuggestionClick(suggestion.text)}
          disabled={isLoading}
          className="suggestion-chip text-xs py-2 px-3 touch-target-sm"
        >
          <suggestion.icon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className={isBengali ? "bangla-body" : ""}>{suggestion.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;
