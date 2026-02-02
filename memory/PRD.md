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
- Directs users to appropriate feature tabs for live data

#### 2. Premium Glassmorphism UI
- Ocean Blue & Teal color scheme
- Dark mode support
- Responsive design (desktop + mobile)
- Bengali font stack (Kalpurush, SolaimanLipi, Noto Sans Bengali)
- Custom logo and favicon

#### 3. Live Cricket Scores (🏏) - ✅ REAL API
- **API:** CricketData.org (cricapi.com)
- Live T20, ODI, Test matches
- ICC tournaments, BPL, IPL, World Cup
- Real-time score updates
- Bengali team name translations

#### 4. Live Football Scores (⚽)
- Premier League, La Liga, Champions League
- Live match minutes
- **Note: MOCKED data - ready for API integration**

#### 5. Breaking News (📰) - ✅ REAL API
- **API:** NewsData.io
- Real Bangladesh news in Bengali
- Sources: Kaler Kantho, Prothom Alo, etc.
- Category filters (জাতীয়, আন্তর্জাতিক, অর্থনীতি, খেলা, প্রযুক্তি, বিনোদন)
- Relative time display in Bengali

#### 6. Multi-language Translation (🌐) - ✅ WORKING
- 11 languages supported
- AI-powered translation via Gemini
- Swap languages feature
- Copy to clipboard

#### 7. Currency Exchange (💱)
- BDT as base currency
- 8 major currencies
- **Note: MOCKED rates - ready for API integration**

#### 8. Prayer Times (🕌) - ✅ REAL API
- **API:** Aladhan.com (FREE, no key needed)
- All 6 prayer times
- 8 Bangladesh cities
- Hijri date display

#### 9. Weather Widget - ✅ REAL API
- **API:** OpenMeteo (FREE, no key needed)
- Bangladesh cities support
- Bengali weather descriptions

---

## API Keys Configured

| Service | Key Location | Status |
|---------|--------------|--------|
| Cricket | CRICKET_API_KEY in backend/.env | ✅ Active |
| News | NEWS_API_KEY in backend/.env | ✅ Active |
| Prayer | No key needed (Aladhan) | ✅ Working |
| Weather | No key needed (OpenMeteo) | ✅ Working |
| AI Chat | EMERGENT_LLM_KEY | ✅ Working |

---

## Technical Architecture

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/cricket/live | GET | Live cricket scores |
| /api/news | GET | Bangladesh news |
| /api/news?category=X | GET | Filtered news |
| /api/translate | POST | AI translation |
| /api/chat/* | Various | Chat operations |

---

## Changelog

### 2026-02-02 (Latest)
- ✅ Integrated CricketData.org API for LIVE cricket scores
- ✅ Integrated NewsData.io API for REAL Bangladesh news
- ✅ Fixed AI giving outdated sports info (now directs to tabs)
- ✅ Added Bengali team name translations
- ✅ Added relative time formatting in Bengali

### Previous
- Premium Glassmorphism UI
- All feature tabs (Sports, News, Translate, Exchange, Prayer)
- Mobile bottom navigation
- Gemini 3 Flash AI integration
