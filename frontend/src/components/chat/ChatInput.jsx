import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useVoiceInput from "@/hooks/useVoiceInput";

/**
 * Voice Recording Indicator - Premium Animation
 */
const VoiceRecordingIndicator = ({ isRecording }) => {
  if (!isRecording) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="absolute -top-20 left-1/2 transform -translate-x-1/2 glass-panel rounded-2xl px-5 py-3 flex items-center gap-4 shadow-lg"
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        className="w-4 h-4 rounded-full bg-destructive voice-recording-pulse"
      />
      <span className="text-sm font-medium bangla-body text-foreground">
        শুনছি... বাংলায় বলুন
      </span>
      <div className="voice-wave">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            animate={{ height: [8, 20, 8] }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.6, 
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Premium Chat Input Component
 * Floating glass bar with voice and text input
 */
export const ChatInput = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "আপনার বার্তা লিখুন বা কথা বলুন..."
}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
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
  }, [isListening]);

  // Handle voice transcript
  useEffect(() => {
    if (!isListening && transcript) {
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
      resetTranscript();
      toast.success("ভয়েস ইনপুট সম্পন্ন!", {
        icon: "🎤",
        duration: 2000
      });
      inputRef.current?.focus();
    }
  }, [isListening, transcript, resetTranscript]);
  
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading && !isRecording) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  }, [inputValue, isLoading, isRecording, onSendMessage]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-4 lg:px-6">
      <form onSubmit={handleSubmit} className="relative">
        {/* Voice Recording Indicator */}
        <AnimatePresence>
          <VoiceRecordingIndicator isRecording={isRecording} />
        </AnimatePresence>
        
        {/* Premium Floating Input Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="floating-input-bar flex items-end gap-3"
        >
          {/* Voice Input Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            disabled={isLoading || !isSupported}
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 touch-target ${
              isListening 
                ? 'bg-destructive text-destructive-foreground shadow-lg voice-recording-pulse' 
                : 'bg-card/60 hover:bg-card text-foreground border border-border/50'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isListening ? "থামান" : isSupported ? "কথা বলুন" : "ভয়েস সাপোর্ট নেই"}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Mic className="w-5 h-5" />
              </motion.div>
            ) : isSupported ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </motion.button>
          
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "শুনছি..." : placeholder}
              rows={1}
              className="glass-input w-full resize-none min-h-[44px] max-h-[120px] py-3 pr-4 bangla-body mobile-input"
              style={{ height: '44px' }}
              disabled={isLoading || isRecording}
            />
          </div>
          
          {/* Send Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim() || isLoading || isRecording}
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 touch-target ${
              inputValue.trim() && !isLoading && !isRecording
                ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default ChatInput;
