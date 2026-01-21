import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

// Import refactored components
import { Sidebar, ChatWindow, SuggestionChips, WelcomeScreen } from "@/components/chat";
import useVoiceInput from "@/hooks/useVoiceInput";
import { fetchWeather, isWeatherQuery } from "@/services/weatherService";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Animated Background Component
 */
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px] animate-pulse-soft" />
    <div className="absolute top-1/3 -right-20 w-60 h-60 bg-accent/20 rounded-full filter blur-[80px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary-glow/15 rounded-full filter blur-[90px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
  </div>
);

/**
 * Message Input Component (inline for better state management)
 */
const MessageInputArea = ({ 
  onSendMessage, 
  isLoading, 
  isRecording, 
  setIsRecording,
  inputValue,
  setInputValue
}) => {
  const inputRef = React.useRef(null);
  const { 
    isListening, 
    transcript, 
    isSupported, 
    toggleListening, 
    resetTranscript 
  } = useVoiceInput();
  
  // Update recording state
  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening, setIsRecording]);

  // Handle voice transcript
  useEffect(() => {
    if (!isListening && transcript) {
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
      resetTranscript();
      toast.success("ভয়েস ইনপুট সম্পন্ন!");
      inputRef.current?.focus();
    }
  }, [isListening, transcript, resetTranscript, setInputValue]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isRecording) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 lg:px-6">
      <form onSubmit={handleSubmit} className="relative">
        {/* Voice Recording Indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-3 rounded-full bg-destructive"
            />
            <span className="text-sm bangla-body text-foreground">শুনছি... বাংলায় বলুন</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{ height: [8, 16, 8] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        <div className="glass-card p-2 flex items-end gap-2">
          {/* Voice Input Button */}
          <Button
            type="button"
            variant={isListening ? "destructive" : "glass"}
            size="icon-lg"
            onClick={toggleListening}
            disabled={isLoading || !isSupported}
            className={`flex-shrink-0 rounded-xl transition-all duration-300 touch-target ${
              isListening ? 'animate-pulse bg-destructive shadow-glow' : ''
            }`}
            title={isListening ? "থামান" : "কথা বলুন"}
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </motion.div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            )}
          </Button>
          
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "শুনছি..." : "আপনার বার্তা লিখুন বা কথা বলুন..."}
            rows={1}
            className="flex-1 glass-input resize-none min-h-[44px] max-h-32 py-3 bangla-body mobile-input"
            style={{ height: 'auto', minHeight: '44px', maxHeight: '128px' }}
            disabled={isLoading || isRecording}
          />
          <Button
            type="submit"
            variant="primary"
            size="icon-lg"
            disabled={!inputValue.trim() || isLoading || isRecording}
            className="flex-shrink-0 rounded-xl touch-target"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

// Need React for useRef
import React from "react";

/**
 * Main Chat Page Component
 */
export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Get last message for smart suggestions
  const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "";
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  }, [isDarkMode]);
  
  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Fetch messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);
  
  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/chat/sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };
  
  const fetchMessages = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/chat/messages/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  const createNewSession = async () => {
    try {
      const response = await axios.post(`${API}/chat/session`, { title: "নতুন কথোপকথন" });
      setSessions([response.data, ...sessions]);
      setCurrentSessionId(response.data.id);
      setMessages([]);
      setIsSidebarOpen(false);
      toast.success("নতুন কথোপকথন শুরু হয়েছে!");
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("সেশন তৈরি করতে সমস্যা হয়েছে");
    }
  };
  
  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API}/chat/session/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      toast.success("সেশন মুছে ফেলা হয়েছে");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("সেশন মুছতে সমস্যা হয়েছে");
    }
  };
  
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Create session if not exists
    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        const response = await axios.post(`${API}/chat/session`, {
          title: content.slice(0, 30) + (content.length > 30 ? "..." : "")
        });
        sessionId = response.data.id;
        setSessions([response.data, ...sessions]);
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error("Error creating session:", error);
        toast.error("সেশন তৈরি করতে সমস্যা হয়েছে");
        return;
      }
    }
    
    // Add user message to UI immediately
    const userMessage = {
      id: Date.now().toString(),
      session_id: sessionId,
      role: "user",
      content: content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Check if it's a weather query and fetch weather data
      let weatherData = null;
      if (isWeatherQuery(content)) {
        try {
          weatherData = await fetchWeather(content);
        } catch (e) {
          console.log("Weather fetch failed:", e);
        }
      }
      
      const response = await axios.post(`${API}/chat/send`, {
        session_id: sessionId,
        message: content
      });
      
      // Add AI response with weather data if available
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        session_id: sessionId,
        role: "assistant",
        content: response.data.response,
        timestamp: response.data.timestamp,
        weather: weatherData // Attach weather data if available
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };
  
  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setIsSidebarOpen(false);
        }}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 glass-card rounded-none lg:rounded-b-2xl border-b border-border/50 lg:mx-4 lg:mt-4 relative z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden relative z-30 touch-target"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center lg:hidden">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground bangla-heading text-sm lg:text-base">
                  {currentSessionId 
                    ? sessions.find(s => s.id === currentSessionId)?.title || 'কথোপকথন'
                    : 'বিডিআস্ক AI'
                  }
                </h1>
                <p className="text-xs text-muted-foreground hidden lg:block">
                  Gemini 3 Flash দ্বারা চালিত
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full touch-target"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>
        
        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 && !currentSessionId ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatWindow messages={messages} isLoading={isLoading} />
          )}
        </div>
        
        {/* Input area */}
        <MessageInputArea
          onSendMessage={sendMessage}
          isLoading={isLoading}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        
        {/* Smart suggestions when in conversation */}
        {currentSessionId && messages.length > 0 && !isLoading && (
          <div className="px-4 pb-4 lg:px-6">
            <SuggestionChips 
              onSuggestionClick={handleSuggestionClick}
              lastMessage={lastMessage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
