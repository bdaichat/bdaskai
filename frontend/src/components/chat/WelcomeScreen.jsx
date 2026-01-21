import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import SuggestionChips from "./SuggestionChips";

// Full suggestion set for welcome screen
const WELCOME_SUGGESTIONS = [
  { icon: "Newspaper", text: "আজকের খবর কি?", category: "news" },
  { icon: "HelpCircle", text: "বাংলাদেশ সম্পর্কে বলুন", category: "knowledge" },
  { icon: "BookOpen", text: "একটি গল্প লিখুন", category: "creative" },
  { icon: "Lightbulb", text: "নতুন কিছু শিখতে চাই", category: "education" },
  { icon: "Sparkles", text: "আজ আমাকে অনুপ্রাণিত করুন", category: "motivation" },
  { icon: "MessageCircle", text: "কথা বলতে চাই", category: "chat" }
];

/**
 * Welcome Screen Component
 * Displays when no chat session is active
 */
export const WelcomeScreen = ({ onSuggestionClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mb-6"
      >
        <Bot className="w-10 h-10 text-primary-foreground" />
      </motion.div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-foreground bangla-heading mb-2">
        স্বাগতম বিডিআস্কে!
      </h2>
      <p className="text-muted-foreground bangla-body mb-8 max-w-md">
        আমি আপনার বাংলাদেশী AI সহকারী। যেকোনো প্রশ্ন করুন - বাংলা বা ইংরেজিতে। 
        <span className="text-primary font-medium"> মাইক বাটনে ক্লিক করে কথাও বলতে পারেন!</span>
      </p>
      
      {/* Suggestions */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-muted-foreground mb-4 bangla-body">
          শুরু করতে একটি বিষয় বেছে নিন:
        </p>
        <SuggestionChips 
          onSuggestionClick={onSuggestionClick}
          lastMessage="" 
          showAll={true}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        />
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
