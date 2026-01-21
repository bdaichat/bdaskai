import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

// Import premium components
import { 
  Sidebar, 
  ChatWindow, 
  ChatInput,
  SuggestionChips, 
  WelcomeScreen 
} from "@/components/chat";
import { fetchWeather, isWeatherQuery } from "@/services/weatherService";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Premium Ocean Atmosphere Background
 * Creates the premium floating effect with animated gradient blobs
 */
const OceanAtmosphere = () => (
  <div className="ocean-atmosphere">
    <div className="ocean-blob ocean-blob-1" />
    <div className="ocean-blob ocean-blob-2" />
    <div className="ocean-blob ocean-blob-3" />
  </div>
);

/**
 * Main Chat Page Component - Premium Version
 */
export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get last message for smart suggestions
  const lastMessage = messages.length > 0 
    ? messages[messages.length - 1].content 
    : "";
  
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
      const response = await axios.post(`${API}/chat/session`, { 
        title: "নতুন কথোপকথন" 
      });
      setSessions([response.data, ...sessions]);
      setCurrentSessionId(response.data.id);
      setMessages([]);
      setIsSidebarOpen(false);
      toast.success("নতুন কথোপকথন শুরু হয়েছে!", {
        icon: "✨",
        duration: 2000
      });
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
      toast.success("সেশন মুছে ফেলা হয়েছে", {
        icon: "🗑️",
        duration: 2000
      });
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
        weather: weatherData
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
    <div className="h-screen flex overflow-hidden relative bg-background">
      {/* Premium Ocean Atmosphere Background */}
      <OceanAtmosphere />
      
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
        {/* Premium Header */}
        <header className="flex items-center justify-between px-4 py-3 glass-card rounded-none lg:rounded-b-2xl border-b border-border/30 lg:mx-4 lg:mt-4 relative z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden rounded-xl hover:bg-card/80 touch-target"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              {/* Mobile logo */}
              <div className="relative lg:hidden">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-40 blur-md" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              
              <div>
                <h1 className="font-semibold text-foreground bangla-heading text-sm lg:text-base">
                  {currentSessionId 
                    ? sessions.find(s => s.id === currentSessionId)?.title || 'কথোপকথন'
                    : 'বিডিআস্ক AI'
                  }
                </h1>
                <p className="text-xs text-muted-foreground hidden lg:block">
                  Premium • Gemini 3 Flash দ্বারা চালিত
                </p>
              </div>
            </div>
          </div>
          
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-card/80 transition-colors touch-target"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </motion.button>
        </header>
        
        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 && !currentSessionId ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatWindow messages={messages} isLoading={isLoading} />
          )}
        </div>
        
        {/* Smart suggestions (when in conversation) */}
        {currentSessionId && messages.length > 0 && !isLoading && (
          <div className="px-4 lg:px-6 pb-2">
            <SuggestionChips 
              onSuggestionClick={handleSuggestionClick}
              lastMessage={lastMessage}
              isLoading={isLoading}
            />
          </div>
        )}
        
        {/* Premium Chat Input */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholder="আপনার বার্তা লিখুন বা কথা বলুন..."
        />
      </div>
    </div>
  );
}
