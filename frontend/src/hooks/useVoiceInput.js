import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook for Bengali voice recognition using Web Speech API
 * Supports Bengali (Bangladesh) language with proper error handling
 */
export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  
  // Check support synchronously during initialization
  const SpeechRecognition = typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null;
  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
      
      // Configure for Bengali (Bangladesh)
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        let finalText = '';
        let interimText = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          
          if (result.isFinal) {
            finalText += text;
            maxConfidence = Math.max(maxConfidence, result[0].confidence || 0);
          } else {
            interimText += text;
          }
        }
        
        if (finalText) {
          setTranscript(prev => prev + finalText);
          setConfidence(maxConfidence);
        }
        setInterimTranscript(interimText);
      };

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
        
        const errorMessages = {
          'not-allowed': "মাইক্রোফোন অনুমতি দেওয়া হয়নি। দয়া করে ব্রাউজার সেটিংস থেকে অনুমতি দিন।",
          'no-speech': "কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।",
          'network': "নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ পরীক্ষা করুন।",
          'audio-capture': "মাইক্রোফোন পাওয়া যায়নি। ডিভাইস সংযোগ পরীক্ষা করুন।",
          'aborted': "ভয়েস ইনপুট বাতিল হয়েছে।"
        };
        
        const message = errorMessages[event.error] || "ভয়েস ইনপুটে সমস্যা হয়েছে।";
        toast.error(message);
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [SpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      setConfidence(0);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Recognition already started");
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setConfidence(0);
  }, []);

  // Change language dynamically
  const setLanguage = useCallback((lang) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    confidence,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    setLanguage
  };
};

export default useVoiceInput;
