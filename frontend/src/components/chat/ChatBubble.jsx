import { motion } from "framer-motion";
import { Bot, User, CloudSun, Thermometer, Wind, Droplets } from "lucide-react";

/**
 * Premium Typing Indicator with Pulse Animation
 */
export const TypingIndicator = () => (
  <div className="typing-indicator">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

/**
 * Premium Weather Card Component
 */
export const WeatherCard = ({ weather }) => {
  if (!weather) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="weather-card glass-panel rounded-2xl p-5 my-3 max-w-sm"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center backdrop-blur-sm">
          <CloudSun className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground bangla-heading">{weather.location}</h4>
          <p className="text-sm text-muted-foreground bangla-body">{weather.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card/50">
          <Thermometer className="w-5 h-5 text-destructive mb-1" />
          <p className="text-xl font-bold text-foreground">{weather.temperature}°C</p>
          <p className="text-xs text-muted-foreground bangla-body">তাপমাত্রা</p>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card/50">
          <Droplets className="w-5 h-5 text-primary mb-1" />
          <p className="text-xl font-bold text-foreground">{weather.humidity}%</p>
          <p className="text-xs text-muted-foreground bangla-body">আর্দ্রতা</p>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card/50">
          <Wind className="w-5 h-5 text-accent mb-1" />
          <p className="text-xl font-bold text-foreground">{weather.windSpeed}</p>
          <p className="text-xs text-muted-foreground bangla-body">বাতাস</p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Premium Chat Bubble Component
 */
export const ChatBubble = ({ message, isUser }) => {
  const hasWeatherCard = message.weather && !isUser;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.35, 
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Premium Avatar */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-primary to-accent' 
            : 'glass-panel'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </motion.div>
      
      {/* Message Content */}
      <div className={`max-w-[78%] ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <p className="bangla-body text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        {hasWeatherCard && <WeatherCard weather={message.weather} />}
      </div>
    </motion.div>
  );
};

/**
 * AI Typing Bubble (Loading State)
 */
export const AITypingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-start gap-3"
  >
    <motion.div 
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="flex-shrink-0 w-10 h-10 rounded-xl glass-panel flex items-center justify-center"
    >
      <Bot className="w-5 h-5 text-primary" />
    </motion.div>
    <div className="chat-bubble-ai">
      <TypingIndicator />
    </div>
  </motion.div>
);

export default ChatBubble;
