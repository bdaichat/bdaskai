/**
 * Prayer Times Service
 * Uses free Aladhan API for accurate Islamic prayer times
 */

import axios from 'axios';

const ALADHAN_API = 'https://api.aladhan.com/v1';

// Bangladesh cities with coordinates
export const BD_CITIES = [
  { id: 'dhaka', name: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'chittagong', name: 'চট্টগ্রাম', nameEn: 'Chittagong' },
  { id: 'sylhet', name: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'rajshahi', name: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'khulna', name: 'খুলনা', nameEn: 'Khulna' },
  { id: 'rangpur', name: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'barishal', name: 'বরিশাল', nameEn: 'Barisal' },
  { id: 'comilla', name: 'কুমিল্লা', nameEn: 'Comilla' }
];

// Prayer names in Bengali
export const PRAYER_NAMES = {
  Fajr: 'ফজর',
  Sunrise: 'সূর্যোদয়',
  Dhuhr: 'যোহর',
  Asr: 'আসর',
  Maghrib: 'মাগরিব',
  Isha: 'এশা'
};

// Demo prayer times
const DEMO_PRAYER_TIMES = {
  city: 'ঢাকা',
  cityEn: 'Dhaka',
  date: new Date().toLocaleDateString('bn-BD'),
  hijriDate: '১৫ রজব ১৪৪৬',
  timings: {
    Fajr: '৫:১৫ AM',
    Sunrise: '৬:৩০ AM',
    Dhuhr: '১২:১০ PM',
    Asr: '৪:২৫ PM',
    Maghrib: '৫:৪৫ PM',
    Isha: '৭:০০ PM'
  },
  nextPrayer: 'Maghrib'
};

/**
 * Convert 24-hour time to 12-hour format with Bengali numerals
 */
const convertTo12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  // Convert to Bengali numerals
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBengali = (num) => {
    return num.toString().split('').map(d => bengaliNumerals[parseInt(d)]).join('');
  };
  
  return `${toBengali(hour12)}:${toBengali(parseInt(minutes))} ${period}`;
};

/**
 * Find the next prayer based on current time
 */
const findNextPrayer = (timings) => {
  const now = new Date();
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  for (const prayer of prayers) {
    const [time] = timings[prayer].split(' ');
    const [hours, minutes] = time.split(':');
    const prayerTime = new Date();
    prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (prayerTime > now) {
      return prayer;
    }
  }
  
  return 'Fajr'; // If all prayers passed, next is tomorrow's Fajr
};

/**
 * Fetch prayer times for a city
 * @param {string} city - City name in English
 * @returns {Promise<Object>} Prayer times object
 */
export const fetchPrayerTimes = async (city = 'Dhaka') => {
  try {
    const response = await axios.get(
      `${ALADHAN_API}/timingsByCity?city=${city}&country=Bangladesh&method=1`
    );
    
    const data = response.data.data;
    const timings = data.timings;
    
    const formattedTimings = {
      Fajr: convertTo12Hour(timings.Fajr),
      Sunrise: convertTo12Hour(timings.Sunrise),
      Dhuhr: convertTo12Hour(timings.Dhuhr),
      Asr: convertTo12Hour(timings.Asr),
      Maghrib: convertTo12Hour(timings.Maghrib),
      Isha: convertTo12Hour(timings.Isha)
    };
    
    const cityInfo = BD_CITIES.find(c => c.nameEn.toLowerCase() === city.toLowerCase());
    
    return {
      city: cityInfo?.name || city,
      cityEn: city,
      date: new Date().toLocaleDateString('bn-BD'),
      hijriDate: `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`,
      timings: formattedTimings,
      nextPrayer: findNextPrayer(timings)
    };
  } catch (error) {
    console.error('Prayer Times API Error:', error);
    // Return demo data on error
    return DEMO_PRAYER_TIMES;
  }
};

/**
 * Get prayer name in Bengali
 */
export const getPrayerNameBn = (prayer) => {
  return PRAYER_NAMES[prayer] || prayer;
};

export default { 
  fetchPrayerTimes, 
  BD_CITIES, 
  PRAYER_NAMES, 
  getPrayerNameBn 
};
