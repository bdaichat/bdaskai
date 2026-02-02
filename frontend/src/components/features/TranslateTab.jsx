import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Copy, Check, Volume2 } from 'lucide-react';
import { translateText, SUPPORTED_LANGUAGES } from '@/services/translationService';
import { toast } from 'sonner';

/**
 * Translation Tab Component
 */
export const TranslateTab = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('bn');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (error) {
      toast.error(error.message || 'অনুবাদে ত্রুটি হয়েছে');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };
  
  const copyToClipboard = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success('কপি করা হয়েছে!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('কপি করতে সমস্যা হয়েছে');
    }
  };
  
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="translate-tab">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground bangla-heading mb-1">
          🌐 বহুভাষিক অনুবাদ
        </h2>
        <p className="text-sm text-muted-foreground bangla-body">
          বাংলাসহ ১১টি ভাষায় অনুবাদ করুন
        </p>
      </div>
      
      {/* Language Selector */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 glass-input text-sm"
          data-testid="source-lang-select"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={swapLanguages}
          className="p-3 rounded-xl glass-panel hover:bg-primary/10 transition-colors"
          data-testid="swap-lang-btn"
        >
          <ArrowRightLeft className="w-5 h-5 text-primary" />
        </motion.button>
        
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 glass-input text-sm"
          data-testid="target-lang-select"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Input Text Area */}
      <div className="glass-card rounded-xl p-3 mb-3">
        <label className="text-xs text-muted-foreground mb-2 block bangla-body">
          টেক্সট লিখুন
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="অনুবাদ করতে এখানে লিখুন..."
          rows={4}
          className="w-full bg-transparent border-none resize-none focus:outline-none text-foreground bangla-body placeholder:text-muted-foreground/50"
          data-testid="translate-input"
        />
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
          <span className="text-xs text-muted-foreground">
            {inputText.length} অক্ষর
          </span>
          <button
            onClick={() => setInputText('')}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            মুছুন
          </button>
        </div>
      </div>
      
      {/* Translate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTranslate}
        disabled={!inputText.trim() || isTranslating}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3 bangla-body"
        data-testid="translate-btn"
      >
        {isTranslating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            অনুবাদ করা হচ্ছে...
          </span>
        ) : (
          'অনুবাদ করুন'
        )}
      </motion.button>
      
      {/* Output Text Area */}
      <div className="glass-card rounded-xl p-3 flex-1">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-muted-foreground bangla-body">
            অনুবাদ
          </label>
          {translatedText && (
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg hover:bg-card/80 transition-colors"
                data-testid="copy-translation-btn"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          )}
        </div>
        <div className="min-h-[100px]">
          {isTranslating ? (
            <div className="flex items-center justify-center py-8">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          ) : translatedText ? (
            <p className="text-foreground bangla-body whitespace-pre-wrap">
              {translatedText}
            </p>
          ) : (
            <p className="text-muted-foreground/50 bangla-body">
              অনুবাদ এখানে দেখাবে...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslateTab;
