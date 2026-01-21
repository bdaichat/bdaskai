import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, CloudSun, Thermometer, Wind, Droplets } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Typing Indicator Component
 */
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-2">
    <span className="typing-dot text-primary"></span>
    <span className="typing-dot text-primary"></span>
    <span className="typing-dot text-primary"></span>
  </div>
);

/**
 * Weather Card Component - Glassmorphism style
 */
export const WeatherCard = ({ weather }) => {
  if (!weather) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="weather-card glass-card p-4 my-2 max-w-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <CloudSun className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground bangla-heading">{weather.location}</h4>
          <p className="text-xs text-muted-foreground">{weather.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-destructive" />
          <div>
            <p className="text-lg font-bold text-foreground">{weather.temperature}°C</p>
            <p className="text-xs text-muted-foreground">তাপমাত্রা</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-primary" />
          <div>
            <p className="text-lg font-bold text-foreground">{weather.humidity}%</p>
            <p className="text-xs text-muted-foreground">আর্দ্রতা</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-accent" />
          <div>
            <p className="text-lg font-bold text-foreground">{weather.windSpeed}</p>
            <p className="text-xs text-muted-foreground">বাতাস</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Message Bubble Component
 */
const MessageBubble = ({ message, isUser }) => {
  // Check if message contains weather data
  const hasWeatherCard = message.weather && !isUser;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-primary to-accent' 
          : 'glass-card'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={`max-w-[75%] ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <p className="bangla-body text-sm md:text-base whitespace-pre-wrap">
          {message.content}
        </p>
        {hasWeatherCard && <WeatherCard weather={message.weather} />}
      </div>
    </motion.div>
  );
};

/**
 * Chat Window Component
 * Displays messages and handles scrolling
 */
export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  
  return (
    <ScrollArea className="h-full custom-scrollbar">
      <div className="p-4 space-y-4 pb-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-ai">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatWindow;
