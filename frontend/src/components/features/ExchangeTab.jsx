import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchExchangeRates, CURRENCIES, convertCurrency, getCurrencyInfo } from '@/services/exchangeService';

/**
 * Currency Card Component
 */
const CurrencyCard = ({ currency, rate, index }) => {
  const info = getCurrencyInfo(currency);
  // Convert: 1 BDT = X currency, so for display: 1 currency = 1/rate BDT
  const bdtValue = (1 / rate).toFixed(2);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 rounded-xl"
      data-testid={`currency-card-${currency}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{info.flag}</span>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          {currency}
        </span>
      </div>
      <p className="text-sm text-muted-foreground bangla-body mb-1">
        {info.name}
      </p>
      <p className="text-lg font-bold text-foreground">
        ৳{bdtValue}
      </p>
      <p className="text-xs text-muted-foreground">
        প্রতি {info.symbol}1
      </p>
    </motion.div>
  );
};

/**
 * Currency Exchange Tab Component
 */
export const ExchangeTab = () => {
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BDT');
  const [convertedAmount, setConvertedAmount] = useState(null);
  
  const loadRates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExchangeRates();
      setRates(data);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadRates();
  }, []);
  
  useEffect(() => {
    if (rates && amount) {
      const converted = convertCurrency(
        parseFloat(amount) || 0,
        fromCurrency,
        toCurrency,
        rates
      );
      setConvertedAmount(converted);
    }
  }, [amount, fromCurrency, toCurrency, rates]);
  
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const allCurrencies = ['BDT', ...Object.keys(rates?.rates || {})];
  
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar" data-testid="exchange-tab">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground bangla-heading">
            💱 মুদ্রা বিনিময়
          </h2>
          <p className="text-xs text-muted-foreground bangla-body">
            বাংলাদেশি টাকা (BDT) ভিত্তিক
          </p>
        </div>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={loadRates}
          disabled={isLoading}
          className="p-2 rounded-lg glass-panel hover:bg-card/80 transition-colors"
          data-testid="refresh-rates-btn"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
      
      {/* Currency Converter */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <h3 className="text-sm font-medium text-foreground mb-3 bangla-body">
          রূপান্তর করুন
        </h3>
        
        <div className="flex flex-col gap-3">
          {/* Amount Input */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="পরিমাণ লিখুন"
            className="glass-input text-center text-lg font-medium"
            data-testid="amount-input"
          />
          
          {/* Currency Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 glass-input text-sm"
              data-testid="from-currency-select"
            >
              {allCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {getCurrencyInfo(curr).flag} {curr}
                </option>
              ))}
            </select>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={swapCurrencies}
              className="p-3 rounded-xl glass-panel hover:bg-primary/10 transition-colors"
              data-testid="swap-currency-btn"
            >
              <ArrowRightLeft className="w-5 h-5 text-primary" />
            </motion.button>
            
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex-1 glass-input text-sm"
              data-testid="to-currency-select"
            >
              {allCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {getCurrencyInfo(curr).flag} {curr}
                </option>
              ))}
            </select>
          </div>
          
          {/* Result */}
          {convertedAmount !== null && (
            <div className="text-center py-3 bg-primary/5 rounded-xl">
              <p className="text-sm text-muted-foreground bangla-body">
                {getCurrencyInfo(fromCurrency).flag} {amount} {fromCurrency} =
              </p>
              <p className="text-2xl font-bold text-primary">
                {getCurrencyInfo(toCurrency).flag} {convertedAmount.toLocaleString()} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Exchange Rates Grid */}
      <h3 className="text-sm font-medium text-foreground mb-3 bangla-body">
        বর্তমান হার
      </h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      ) : rates ? (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(rates.rates).map(([currency, rate], index) => (
            <CurrencyCard
              key={currency}
              currency={currency}
              rate={rate}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bangla-body">
          মুদ্রার হার লোড করতে সমস্যা হয়েছে
        </div>
      )}
    </div>
  );
};

export default ExchangeTab;
