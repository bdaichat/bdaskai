import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  MessageCircle, 
  Trash2, 
  X,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/Logo";

/**
 * Format relative time in Bengali
 */
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "এইমাত্র";
  if (diffMins < 60) return `${diffMins} মিনিট আগে`;
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
  if (diffDays < 7) return `${diffDays} দিন আগে`;
  return date.toLocaleDateString('bn-BD');
};

/**
 * Premium Chat Sidebar Component
 */
export const Sidebar = ({ 
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
      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Panel */}
      <motion.aside
        initial={false}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 glass-card rounded-none lg:rounded-2xl lg:m-4 lg:h-[calc(100vh-2rem)]
                    flex flex-col shadow-glass-strong ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Premium Logo */}
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-50 blur-md" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground bangla-heading">বিডিআস্ক</h1>
                <p className="text-xs text-muted-foreground">Premium AI সহকারী</p>
              </div>
            </div>
            
            {/* Close button (mobile only) */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:bg-destructive/10 hover:text-destructive rounded-xl touch-target"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewSession}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all touch-target"
          >
            <Plus className="w-5 h-5" />
            <span className="bangla-body">নতুন কথোপকথন</span>
          </motion.button>
        </div>
        
        {/* Sessions List */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground bangla-body">
                  কোনো কথোপকথন নেই
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 bangla-body">
                  নতুন কথোপকথন শুরু করুন
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={`w-full group flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 touch-target ${
                        currentSessionId === session.id
                          ? 'bg-primary/12 border border-primary/30 shadow-sm'
                          : 'hover:bg-card/60 border border-transparent'
                      }`}
                    >
                      {/* Session Icon */}
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        currentSessionId === session.id 
                          ? 'bg-primary/20' 
                          : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <MessageCircle className={`w-4 h-4 ${
                          currentSessionId === session.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      
                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`truncate text-sm font-medium bangla-body ${
                          currentSessionId === session.id ? 'text-primary' : 'text-foreground'
                        }`}>
                          {session.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(session.updated_at || session.created_at)}
                        </p>
                      </div>
                      
                      {/* Delete Button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-all touch-target-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="bangla-body">বাংলাদেশের জন্য তৈরি</span>
            <span className="text-red-500">❤️</span>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-1">
            Powered by Gemini 3 Flash
          </p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
