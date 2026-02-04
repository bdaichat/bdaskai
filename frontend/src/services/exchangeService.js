/**
 * Currency Exchange Service
 * Uses ExchangeRate-API for live exchange rates
 */

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Currency symbols and Bengali names
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'মার্কিন ডলার', nameEn: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'ইউরো', nameEn: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'ব্রিটিশ পাউন্ড', nameEn: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'ভারতীয় রুপি', nameEn: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'SAR', symbol: '﷼', name: 'সৌদি রিয়াল', nameEn: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'ইউএই দিরহাম', nameEn: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'MYR', symbol: 'RM', name: 'মালয়েশিয়ান রিংগিত', nameEn: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'SGD', symbol: 'S$', name: 'সিঙ্গাপুর ডলার', nameEn: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'JPY', symbol: '¥', name: 'জাপানি ইয়েন', nameEn: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'চীনা ইউয়ান', nameEn: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'AUD', symbol: 'A$', name: 'অস্ট্রেলিয়ান ডলার', nameEn: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: 'কানাডিয়ান ডলার', nameEn: 'Canadian Dollar', flag: '🇨🇦' }
];

/**
 * Fetch exchange rates with BDT as base from backend API
 * @returns {Promise<Object>} Exchange rates object
 */
export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/exchange/rates`, {
      timeout: 15000
    });
    
    const data = response.data;
    
    return {
      base: data.base || 'BDT',
      rates: data.rates || {},
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    // Return fallback demo data on error
    return {
      base: 'BDT',
      rates: {
        USD: 0.0083,
        EUR: 0.0077,
        GBP: 0.0066,
        INR: 0.70,
        SAR: 0.031,
        AED: 0.030,
        MYR: 0.039,
        SGD: 0.011
      },
      lastUpdated: new Date().toISOString(),
      isDemo: true
    };
  }
};

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {Object} rates - Current exchange rates (BDT as base)
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, from, to, rates) => {
  if (!rates || !rates.rates) return 0;
  
  // If converting from BDT
  if (from === 'BDT') {
    if (to === 'BDT') return amount;
    return amount * (rates.rates[to] || 0);
  }
  
  // If converting to BDT
  if (to === 'BDT') {
    return amount / (rates.rates[from] || 1);
  }
  
  // Convert between two non-BDT currencies
  // First convert from source to BDT, then BDT to target
  const inBDT = amount / (rates.rates[from] || 1);
  return inBDT * (rates.rates[to] || 0);
};

/**
 * Format currency with proper symbols
 */
export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;
  return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Get currency info by code
 */
export const getCurrencyInfo = (code) => {
  if (code === 'BDT') {
    return { code: 'BDT', symbol: '৳', name: 'বাংলাদেশি টাকা', nameEn: 'Bangladeshi Taka', flag: '🇧🇩' };
  }
  return CURRENCIES.find(c => c.code === code) || { code, name: code, symbol: '', flag: '🏳️' };
};

export default { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency, 
  CURRENCIES, 
  getCurrencyInfo 
};
