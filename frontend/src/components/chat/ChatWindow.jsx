import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble, AITypingBubble } from "./ChatBubble";

/**
 * Premium Chat Window Component
 * Displays messages with smooth scrolling and animations
 */
export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  
  // Smooth scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);
  
  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="h-full custom-scrollbar"
    >
      <div className="p-4 md:p-6 space-y-5 pb-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
        </AnimatePresence>
        
        {/* AI Typing Indicator */}
        <AnimatePresence>
          {isLoading && <AITypingBubble />}
        </AnimatePresence>
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </ScrollArea>
  );
};

export default ChatWindow;
