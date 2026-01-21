import axios from "axios";

const OPENMETEO_BASE_URL = "https://api.open-meteo.com/v1";

// Bangladesh city coordinates
const CITY_COORDINATES = {
  dhaka: { lat: 23.8103, lon: 90.4125, name: "ঢাকা" },
  chittagong: { lat: 22.3569, lon: 91.7832, name: "চট্টগ্রাম" },
  sylhet: { lat: 24.8949, lon: 91.8687, name: "সিলেট" },
  rajshahi: { lat: 24.3745, lon: 88.6042, name: "রাজশাহী" },
  khulna: { lat: 22.8456, lon: 89.5403, name: "খুলনা" },
  rangpur: { lat: 25.7439, lon: 89.2752, name: "রংপুর" },
  barishal: { lat: 22.7010, lon: 90.3535, name: "বরিশাল" },
  comilla: { lat: 23.4607, lon: 91.1809, name: "কুমিল্লা" }
};

// Weather code to Bengali description mapping
const WEATHER_CODES = {
  0: "পরিষ্কার আকাশ",
  1: "প্রধানত পরিষ্কার",
  2: "আংশিক মেঘলা",
  3: "মেঘাচ্ছন্ন",
  45: "কুয়াশা",
  48: "জমাট কুয়াশা",
  51: "হালকা গুঁড়ি বৃষ্টি",
  53: "মাঝারি গুঁড়ি বৃষ্টি",
  55: "ঘন গুঁড়ি বৃষ্টি",
  61: "হালকা বৃষ্টি",
  63: "মাঝারি বৃষ্টি",
  65: "ভারী বৃষ্টি",
  71: "হালকা তুষারপাত",
  73: "মাঝারি তুষারপাত",
  75: "ভারী তুষারপাত",
  80: "হালকা বর্ষণ",
  81: "মাঝারি বর্ষণ",
  82: "তীব্র বর্ষণ",
  95: "বজ্রঝড়",
  96: "শিলাবৃষ্টিসহ বজ্রঝড়",
  99: "ভারী শিলাবৃষ্টিসহ বজ্রঝড়"
};

/**
 * Parse city name from user query (supports Bengali and English)
 */
const parseCityFromQuery = (query) => {
  const queryLower = query.toLowerCase();
  
  // Check for city names
  for (const [key, value] of Object.entries(CITY_COORDINATES)) {
    if (queryLower.includes(key) || query.includes(value.name)) {
      return { key, ...value };
    }
  }
  
  // Default to Dhaka
  return { key: "dhaka", ...CITY_COORDINATES.dhaka };
};

/**
 * Check if message is a weather query
 */
export const isWeatherQuery = (message) => {
  const weatherKeywords = [
    'weather', 'আবহাওয়া', 'তাপমাত্রা', 'temperature', 'বৃষ্টি', 'rain',
    'গরম', 'ঠান্ডা', 'hot', 'cold', 'sunny', 'রোদ', 'মেঘ', 'cloud'
  ];
  
  const messageLower = message.toLowerCase();
  return weatherKeywords.some(keyword => 
    messageLower.includes(keyword) || message.includes(keyword)
  );
};

/**
 * Fetch weather data from OpenMeteo API
 */
export const fetchWeather = async (query) => {
  try {
    const city = parseCityFromQuery(query);
    
    const response = await axios.get(`${OPENMETEO_BASE_URL}/forecast`, {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        current: ['temperature_2m', 'relative_humidity_2m', 'weather_code', 'wind_speed_10m'],
        timezone: 'Asia/Dhaka'
      }
    });
    
    const current = response.data.current;
    const weatherCode = current.weather_code;
    
    return {
      location: city.name,
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: `${Math.round(current.wind_speed_10m)} km/h`,
      description: WEATHER_CODES[weatherCode] || "অজানা",
      weatherCode
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("আবহাওয়ার তথ্য পেতে সমস্যা হয়েছে");
  }
};

/**
 * Format weather data as Bengali text
 */
export const formatWeatherResponse = (weather) => {
  return `${weather.location}ে এখন ${weather.description}। তাপমাত্রা ${weather.temperature}°C, আর্দ্রতা ${weather.humidity}%, এবং বাতাসের গতি ${weather.windSpeed}।`;
};

export default { fetchWeather, isWeatherQuery, formatWeatherResponse };
