import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Plus, 
  MessageCircle, 
  Sparkles, 
  Trash2, 
  Menu,
  X,
  Bot,
  User,
  Newspaper,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Suggestion categories with Bengali text
const SUGGESTIONS = [
  {
    icon: Newspaper,
    text: "আজকের খবর কি?",
    category: "news"
  },
  {
    icon: HelpCircle,
    text: "বাংলাদেশ সম্পর্কে বলুন",
    category: "knowledge"
  },
  {
    icon: BookOpen,
    text: "একটি গল্প লিখুন",
    category: "creative"
  },
  {
    icon: Lightbulb,
    text: "নতুন কিছু শিখতে চাই",
    category: "education"
  },
  {
    icon: Sparkles,
    text: "আজ আমাকে অনুপ্রাণিত করুন",
    category: "motivation"
  },
  {
    icon: MessageCircle,
    text: "কথা বলতে চাই",
    category: "chat"
  }
];

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-2">
    <span className="typing-dot text-primary"></span>
    <span className="typing-dot text-primary"></span>
    <span className="typing-dot text-primary"></span>
  </div>
);

// Message bubble component
const MessageBubble = ({ message, isUser }) => {
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
      
      {/* Message */}
      <div className={`max-w-[75%] ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <p className="bangla-body text-sm md:text-base whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
};

// Sidebar component
const Sidebar = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession, 
  onDeleteSession,
  isOpen,
  onClose 
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass-card rounded-none lg:rounded-2xl lg:m-4 lg:h-[calc(100vh-2rem)]
                    flex flex-col transition-transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground bangla-heading">বিডিআস্ক</h1>
                <p className="text-xs text-muted-foreground">AI সহকারী</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full mt-4"
            onClick={onNewSession}
          >
            <Plus className="w-4 h-4" />
            <span className="bangla-body">নতুন কথোপকথন</span>
          </Button>
        </div>
        
        {/* Sessions list */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      currentSessionId === session.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-secondary border border-transparent'
                    }`}
                  >
                    <MessageCircle className={`w-4 h-4 flex-shrink-0 ${
                      currentSessionId === session.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className={`flex-1 truncate text-sm bangla-body ${
                      currentSessionId === session.id ? 'text-primary font-medium' : 'text-foreground'
                    }`}>
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground bangla-body">
            বাংলাদেশের জন্য তৈরি ❤️
          </p>
        </div>
      </motion.aside>
    </>
  );
};

// Welcome screen component
const WelcomeScreen = ({ onSuggestionClick }) => {
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
      </p>
      
      {/* Suggestions */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-muted-foreground mb-4 bangla-body">
          শুরু করতে একটি বিষয় বেছে নিন:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUGGESTIONS.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="suggestion-chip flex flex-col items-center gap-2 p-4 h-auto"
            >
              <suggestion.icon className="w-5 h-5 text-primary" />
              <span className="text-xs bangla-body text-center">{suggestion.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Animated background component
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Gradient orbs */}
    <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px] animate-pulse-soft" />
    <div className="absolute top-1/3 -right-20 w-60 h-60 bg-accent/20 rounded-full filter blur-[80px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary-glow/15 rounded-full filter blur-[90px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
  </div>
);

// Main ChatPage component
export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
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
      const response = await axios.post(`${API}/chat/send`, {
        session_id: sessionId,
        message: content
      });
      
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        session_id: sessionId,
        role: "assistant",
        content: response.data.response,
        timestamp: response.data.timestamp
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      // Remove the user message if failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 glass-card rounded-none lg:rounded-b-2xl border-b border-border/50 lg:mx-4 lg:mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
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
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </header>
        
        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 && !currentSessionId ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
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
          )}
        </div>
        
        {/* Input area */}
        <div className="p-4 lg:px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="glass-card p-2 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="আপনার বার্তা লিখুন..."
                rows={1}
                className="flex-1 glass-input resize-none min-h-[44px] max-h-32 py-3 bangla-body text-sm md:text-base"
                style={{ 
                  height: 'auto',
                  minHeight: '44px',
                  maxHeight: '128px'
                }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="icon-lg"
                disabled={!inputValue.trim() || isLoading}
                className="flex-shrink-0 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
          
          {/* Quick suggestions when in conversation */}
          {currentSessionId && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap gap-2 justify-center"
            >
              {SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="suggestion-chip text-xs py-1.5 px-3"
                  disabled={isLoading}
                >
                  <suggestion.icon className="w-3.5 h-3.5" />
                  <span className="bangla-body">{suggestion.text}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
