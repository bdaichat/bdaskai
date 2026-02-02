# BdAsk.com - Premium AI Assistant for Bangladesh
## Product Requirements Document

### Original Problem Statement
Build a unique AI assistant named "BdAsk.com" for Bangladesh with primary focus on Bengali language support and a unique premium UI/UX design.

### Target Audience
- Bengali-speaking users in Bangladesh
- Android-first users (95% market share)
- Users on low-bandwidth networks (2G/3G)
- Muslim users needing prayer times
- Sports fans following BPL and international matches

---

## What's Been Implemented

### Core Features (✅ COMPLETE)

#### 1. AI Chat Assistant
- Gemini 3 Flash integration via Emergent LLM Key
- Bengali and English support
- Smart conversation with context awareness
- Session management (create, delete, history)
- Voice input with Bengali speech recognition

#### 2. Premium Glassmorphism UI
- Ocean Blue & Teal color scheme
- Dark mode support
- Responsive design (desktop + mobile)
- Bengali font stack (Kalpurush, SolaimanLipi, Noto Sans Bengali)
- Custom logo and favicon

#### 3. Live Cricket Scores (🏏)
- BPL matches
- International matches (ODI, T20)
- Live status indicators
- Bengali team names and scores
- **Note: MOCKED data - ready for API integration**

#### 4. Live Football Scores (⚽)
- Premier League
- La Liga
- Champions League
- Live match minutes
- **Note: MOCKED data - ready for API integration**

#### 5. Breaking News (📰)
- Category filters (জাতীয়, আন্তর্জাতিক, অর্থনীতি, খেলা, প্রযুক্তি, বিনোদন)
- Bengali news sources
- Time-based updates
- **Note: MOCKED data - ready for API integration**

#### 6. Multi-language Translation (🌐)
- 11 languages supported (Bengali, English, Hindi, Urdu, Arabic, Spanish, French, German, Chinese, Japanese, Korean)
- AI-powered translation via Gemini
- Swap languages feature
- Copy to clipboard

#### 7. Currency Exchange (💱)
- BDT as base currency
- 8 major currencies (USD, EUR, GBP, INR, SAR, AED, MYR, SGD)
- Currency converter
- **Note: MOCKED rates - ready for API integration**

#### 8. Prayer Times (🕌)
- All 6 prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- 8 Bangladesh cities
- Hijri date display
- Next prayer highlighting
- Uses Aladhan API (FREE)

#### 9. Weather Widget
- OpenMeteo API integration (FREE)
- Bangladesh cities support
- Bengali weather descriptions
- Appears in chat for weather queries

---

## Technical Architecture

### Frontend
- React 18 with hooks
- TailwindCSS with custom design tokens
- Framer Motion for animations
- Shadcn/UI components
- Axios for API calls

### Backend
- Python FastAPI
- MongoDB database
- Emergent Integrations for AI

### File Structure
```
/app
├── backend/
│   ├── server.py          # FastAPI server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/      # Chat components
│   │   │   ├── features/  # Feature tabs
│   │   │   └── ui/        # Shadcn components
│   │   ├── services/      # API services
│   │   │   ├── weatherService.js
│   │   │   ├── cricketService.js
│   │   │   ├── footballService.js
│   │   │   ├── newsService.js
│   │   │   ├── translationService.js
│   │   │   ├── exchangeService.js
│   │   │   └── prayerService.js
│   │   └── pages/
│   │       └── ChatPage.jsx
```

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/ | GET | Welcome message |
| /api/status | GET/POST | Health check |
| /api/chat/session | POST | Create session |
| /api/chat/sessions | GET | List sessions |
| /api/chat/send | POST | Send message |
| /api/chat/messages/{id} | GET | Get messages |
| /api/chat/session/{id} | DELETE | Delete session |
| /api/translate | POST | Translate text |

---

## What's MOCKED (Ready for Real API Integration)

1. **Cricket Scores** - Replace demo data in `cricketService.js` with CricketData.org or Sportmonks API
2. **Football Scores** - Replace demo data in `footballService.js` with Football-Data.org API
3. **News Articles** - Replace demo data in `newsService.js` with NewsData.io API
4. **Exchange Rates** - Replace demo data in `exchangeService.js` with ExchangeRate-API

See `/tmp/bdask-complete/bdask-ai-complete/API_INTEGRATION.md` for detailed integration guides.

---

## Upcoming Features (Backlog)

### P1 - High Priority
- [ ] Real API integration for sports scores
- [ ] Real API integration for news
- [ ] Real API integration for exchange rates
- [ ] PWA support with offline caching

### P2 - Medium Priority
- [ ] Low bandwidth mode toggle
- [ ] bKash/Nagad payment UI stubs
- [ ] Push notifications for prayer times

### P3 - Future Enhancements
- [ ] Image input for AI chat
- [ ] Voice output (TTS)
- [ ] User accounts and personalization
- [ ] Favorite teams/news categories

---

## Testing Status

| Feature | Status | Test Coverage |
|---------|--------|---------------|
| Chat AI | ✅ PASSED | API + UI |
| Weather | ✅ PASSED | API + Widget |
| Translation | ✅ PASSED | API + UI |
| Prayer Times | ✅ PASSED | API + UI |
| Sports Tab | ✅ PASSED | UI (MOCKED) |
| News Tab | ✅ PASSED | UI (MOCKED) |
| Exchange Tab | ✅ PASSED | UI (MOCKED) |
| Mobile View | ✅ PASSED | Responsive |
| Dark Mode | ✅ PASSED | Theme toggle |

---

## Known Issues

1. **PostHog Analytics Error** - Third-party script error (suppressed, not affecting app)
2. **Minor ESLint Warnings** - React Hook dependencies in SuggestionChips.jsx, PrayerTab.jsx

---

## Changelog

### 2026-02-02
- ✅ Integrated comprehensive feature set from user-provided zip file
- ✅ Added Sports tab (Cricket + Football scores)
- ✅ Added News tab with category filters
- ✅ Added Translation tab (11 languages)
- ✅ Added Currency Exchange tab
- ✅ Added Prayer Times tab
- ✅ Added bottom navigation for mobile
- ✅ Added feature navigation to sidebar
- ✅ Created all service files for feature data
- ✅ Added /api/translate endpoint
- ✅ All tests passing

### Previous
- Premium Glassmorphism UI
- Gemini 3 Flash AI integration
- Voice input with Bengali speech
- Weather widget
- Custom branding (logo, favicon)
