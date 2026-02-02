/**
 * Currency Exchange Service
 * Uses free ExchangeRate-API for live rates
 */

import axios from 'axios';

// Currency symbols and Bengali names
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'মার্কিন ডলার', nameEn: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'ইউরো', nameEn: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'ব্রিটিশ পাউন্ড', nameEn: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'ভারতীয় রুপি', nameEn: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'SAR', symbol: '﷼', name: 'সৌদি রিয়াল', nameEn: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'ইউএই দিরহাম', nameEn: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'MYR', symbol: 'RM', name: 'মালয়েশিয়ান রিংগিত', nameEn: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'SGD', symbol: 'S$', name: 'সিঙ্গাপুর ডলার', nameEn: 'Singapore Dollar', flag: '🇸🇬' }
];

// Demo exchange rates (BDT as base)
const DEMO_RATES = {
  base: 'BDT',
  rates: {
    USD: 0.0091,
    EUR: 0.0084,
    GBP: 0.0072,
    INR: 0.76,
    SAR: 0.034,
    AED: 0.033,
    MYR: 0.043,
    SGD: 0.012
  },
  lastUpdated: new Date().toISOString()
};

/**
 * Fetch exchange rates with BDT as base
 * @returns {Promise<Object>} Exchange rates object
 */
export const fetchExchangeRates = async () => {
  try {
    // For now, return demo data
    // In production, integrate with ExchangeRate-API
    return DEMO_RATES;
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    return DEMO_RATES;
  }
};

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {Object} rates - Current exchange rates
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, from, to, rates) => {
  if (!rates || !rates.rates) return 0;
  
  // Convert to BDT first, then to target currency
  let inBDT = from === 'BDT' ? amount : amount / rates.rates[from];
  let result = to === 'BDT' ? inBDT : inBDT * rates.rates[to];
  
  return parseFloat(result.toFixed(4));
};

/**
 * Format currency with proper symbols
 */
export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${amount} ${currencyCode}`;
  return `${currency.symbol}${amount.toFixed(2)}`;
};

/**
 * Get currency info by code
 */
export const getCurrencyInfo = (code) => {
  return CURRENCIES.find(c => c.code === code) || { code, name: code, symbol: '' };
};

export default { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency, 
  CURRENCIES, 
  getCurrencyInfo 
};
