# 🚀 BdAsk.com Deployment Guide

## Overview
BdAsk is a full-stack application with:
- **Frontend**: React (Create React App)
- **Backend**: Python FastAPI
- **Database**: MongoDB

---

## Option 1: Vercel (Frontend) + Railway/Render (Backend)

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app
2. **Create New Project** → "Deploy from GitHub"
3. **Connect your GitHub repo**
4. **Set Root Directory**: `/backend`
5. **Add Environment Variables**:
   ```
   MONGO_URL=mongodb+srv://your-mongo-url
   DB_NAME=bdask_production
   EMERGENT_LLM_KEY=your-emergent-key
   CRICKET_API_KEY=your-cricket-api-key
   NEWS_API_KEY=your-news-api-key
   FOOTBALL_API_KEY=your-football-api-key
   EXCHANGE_API_KEY=your-exchange-api-key
   CORS_ORIGINS=https://your-vercel-domain.vercel.app
   ```
6. **Deploy** → Get your backend URL (e.g., `https://bdask-api.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com
2. **Import Project** → Connect GitHub repo
3. **Set Root Directory**: `frontend`
4. **Framework Preset**: Create React App
5. **Add Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://bdask-api.railway.app
   ```
6. **Deploy!**

---

## Option 2: Render (Full Stack)

### Deploy Backend

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Settings**:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**: (same as Railway above)
5. **Deploy**

### Deploy Frontend

1. **New Static Site** → Connect GitHub
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Publish Directory**: `build`
3. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com
   ```
4. **Deploy**

---

## Option 3: DigitalOcean App Platform

### Single Deployment (Monorepo)

1. **Create DigitalOcean Account**: https://digitalocean.com
2. **App Platform** → Create App → GitHub
3. **Add Components**:

   **Component 1: Backend (Web Service)**
   - Source: `/backend`
   - Build: `pip install -r requirements.txt`
   - Run: `uvicorn server:app --host 0.0.0.0 --port 8080`
   - HTTP Port: 8080

   **Component 2: Frontend (Static Site)**
   - Source: `/frontend`
   - Build: `yarn build`
   - Output: `build`

4. **Environment Variables** for backend
5. **Deploy**

---

## Option 4: AWS (Advanced)

### Architecture
```
┌─────────────────┐     ┌─────────────────┐
│   CloudFront    │────▶│    S3 Bucket    │
│   (CDN)         │     │   (Frontend)    │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   API Gateway   │────▶│     Lambda      │
│                 │     │   (Backend)     │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
└─────────────────┘
```

### Steps
1. **S3 + CloudFront** for frontend static hosting
2. **Lambda + API Gateway** for backend (use Mangum adapter)
3. **MongoDB Atlas** for database

---

## Option 5: Docker Deployment (Any Cloud)

### Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    env_file:
      - ./backend/.env
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Deploy to:
- **Google Cloud Run**
- **AWS ECS/Fargate**
- **Azure Container Apps**
- **DigitalOcean Kubernetes**

---

## Database: MongoDB Atlas (Recommended)

1. **Create Account**: https://cloud.mongodb.com
2. **Create Cluster** (Free M0 tier available)
3. **Database Access** → Add User
4. **Network Access** → Allow from anywhere (0.0.0.0/0)
5. **Connect** → Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bdask
   ```

---

## Environment Variables Reference

### Backend (.env)
```env
# Database
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/bdask
DB_NAME=bdask_production

# AI
EMERGENT_LLM_KEY=sk-emergent-xxxxx

# APIs
CRICKET_API_KEY=xxxxx
NEWS_API_KEY=pub_xxxxx
FOOTBALL_API_KEY=xxxxx
EXCHANGE_API_KEY=xxxxx

# Security
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

---

## Custom Domain Setup

### Vercel
1. **Settings** → **Domains** → Add `bdask.com`
2. **DNS**: Add CNAME record pointing to `cname.vercel-dns.com`

### Render
1. **Settings** → **Custom Domain** → Add domain
2. **DNS**: Add CNAME record as shown

### Cloudflare (Recommended for DNS)
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Add DNS records
4. Enable SSL/TLS (Full)

---

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify MongoDB connection
- [ ] Check CORS settings
- [ ] Test AI chat functionality
- [ ] Verify all external APIs (Cricket, News, etc.)
- [ ] Enable HTTPS
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Configure error tracking (Sentry)

---

## Cost Estimates (Monthly)

| Platform | Frontend | Backend | Database | Total |
|----------|----------|---------|----------|-------|
| Vercel + Railway | Free | $5 | Free (Atlas M0) | **$5** |
| Render | Free | $7 | Free (Atlas M0) | **$7** |
| DigitalOcean | $5 | $5 | $15 | **$25** |
| AWS (minimal) | $1 | $10 | Free (Atlas M0) | **$11** |

---

## Support

For deployment issues, contact:
- Emergent Platform Support
- Open GitHub Issue

---

**Happy Deploying! 🚀**
