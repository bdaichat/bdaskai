import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  MessageCircle, 
  Sparkles, 
  Trash2, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Chat Sidebar Component
 * Displays chat history and allows creating/deleting sessions
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass-card rounded-none lg:rounded-2xl lg:m-4 lg:h-[calc(100vh-2rem)]
                    flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ transition: 'transform 0.3s ease-in-out' }}
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
              className="lg:hidden touch-target"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full mt-4 touch-target"
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
                    className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 touch-target ${
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
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all touch-target-sm"
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

export default Sidebar;
