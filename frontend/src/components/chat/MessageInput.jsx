import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useVoiceInput from "@/hooks/useVoiceInput";

/**
 * Voice Input Button Component
 */
const VoiceInputButton = ({ onTranscript, disabled, isRecording, setIsRecording }) => {
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    isSupported, 
    toggleListening,
    resetTranscript 
  } = useVoiceInput();

  // Update parent recording state
  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening, setIsRecording]);

  // Send transcript to parent when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, onTranscript, resetTranscript]);

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        disabled
        className="flex-shrink-0 rounded-xl opacity-50 touch-target"
        title="আপনার ব্রাউজার ভয়েস ইনপুট সমর্থন করে না"
      >
        <MicOff className="w-5 h-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "glass"}
      size="icon-lg"
      onClick={toggleListening}
      disabled={disabled}
      className={`flex-shrink-0 rounded-xl transition-all duration-300 touch-target ${
        isListening ? 'animate-pulse bg-destructive shadow-glow' : ''
      }`}
      title={isListening ? "থামান" : "কথা বলুন"}
    >
      {isListening ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Mic className="w-5 h-5" />
        </motion.div>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};

/**
 * Voice Recording Indicator
 */
const VoiceRecordingIndicator = ({ isRecording }) => {
  if (!isRecording) return null;
  
  return (
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
      <span className="text-sm bangla-body text-foreground">
        শুনছি... বাংলায় বলুন
      </span>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            animate={{ 
              height: [8, 16, 8],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5, 
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
 * Message Input Component
 * Handles text input, voice input, and message submission
 */
export const MessageInput = ({ 
  onSendMessage, 
  isLoading, 
  isRecording, 
  setIsRecording 
}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  
  // Handle voice transcript
  const handleVoiceTranscript = useCallback((transcript) => {
    if (transcript.trim()) {
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
      toast.success("ভয়েস ইনপুট সম্পন্ন!");
      inputRef.current?.focus();
    }
  }, []);
  
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
        <AnimatePresence>
          <VoiceRecordingIndicator isRecording={isRecording} />
        </AnimatePresence>
        
        <div className="glass-card p-2 flex items-end gap-2">
          {/* Voice Input Button */}
          <VoiceInputButton 
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
          
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "শুনছি..." : "আপনার বার্তা লিখুন বা কথা বলুন..."}
            rows={1}
            className="flex-1 glass-input resize-none min-h-[44px] max-h-32 py-3 bangla-body text-base mobile-input"
            style={{ 
              height: 'auto',
              minHeight: '44px',
              maxHeight: '128px'
            }}
            disabled={isLoading || isRecording}
          />
          <Button
            type="submit"
            variant="primary"
            size="icon-lg"
            disabled={!inputValue.trim() || isLoading || isRecording}
            className="flex-shrink-0 rounded-xl touch-target"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
