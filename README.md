# Equinoux 🌐✨

Equinoux is a full‑stack web application that allows users to analyze websites using **Lighthouse**, **Puppeteer**, and **Axe‑core**.  
It provides a modern React/Vite frontend with a **Frutiger Dark aesthetic** and built-in music player, paired with a robust Node/Express backend deployed on **Google Cloud Run**.

> **Design Philosophy:** This project demonstrates that beautiful, engaging UIs don't require flat minimalism. Equinoux embraces a playful, glossy Frutiger Dark design with depth, gradients, and personality—proving that functional tools can be fun.

---

## ✨ Features

### Frontend (React + Vite)
- **🎨 Frutiger Dark Design**: Glossy UI with depth, gradients, and vibrant colors—moving beyond flat minimalism
- **🔍 Website Analysis Interface**: Simple URL input to run comprehensive tests
- **📊 Results Dashboard**: Displays Lighthouse, Puppeteer, and Axe‑core results in an organized grid
- **🎵 Built-in Music Player**: 
  - Random song selection from curated playlist
  - Play/pause, next/previous controls
  - Seek bar with real-time progress
  - Background music while analyzing
- **🚀 Deployed on GitHub Pages**:  
  👉 [Live Demo](https://nosoyunmarinero.github.io/Equinoux/)

### Backend (Node + Express)
- **⚡ Three Analysis Endpoints**:
  - `/analyze` → Lighthouse (performance, accessibility)
  - `/puppeteer` → Page load time and title extraction
  - `/axe` → Accessibility violations detection
- **🔄 Combined Analysis**:
  - `/full-analysis` → Runs all three tools simultaneously and returns unified JSON
- **☁️ Deployed on Render**:  
  👉 [API Endpoint](https://equinoux.onrender.com)
- **💰 Serverless Architecture**: Auto-scales from 0 to 10 instances, pay only for actual usage

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 (Frutiger Dark theme with glassmorphism)
- **HTTP Client**: Axios
- **Audio**: HTML5 Audio API
- **Deployment**: GitHub Pages

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Testing Tools**:
  - `lighthouse` - Google's web performance auditing tool
  - `chrome-launcher` - Programmatic Chrome control
  - `puppeteer` - Headless browser automation
  - `axe-core` - Accessibility testing engine
- **Containerization**: Docker
- **Browser**: Chromium (headless)
- **Deployment**: Render
- **Infrastructure**: Serverless with automatic scaling

---


## 📡 API Documentation

### Base URL
```
Production: https://equinoux.onrender.com
Local: http://localhost:3001
```

### Endpoints

#### 1. Health Check
```http
GET /
```
**Response:**
```json
{
  "mensaje": "Servidor backend corriendo :D",
  "status": "ok"
}
```

#### 2. Lighthouse Analysis
```http
POST /analyze
Content-Type: application/json

{
  "url": "https://example.com"
}
```
**Response:**
```json
{
  "url": "https://example.com",
  "performance": 0.95,
  "accessibility": 0.88,
  "seo": 0.92,
  "bestPractices": 0.90,
  "issues": {
    "accessibility": {...},
    "seo": {...},
    "bestPractices": {...}
  }
}
```

#### 3. Puppeteer Analysis
```http
POST /puppeteer
Content-Type: application/json

{
  "url": "https://example.com"
}
```
**Response:**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "loadTime": "1250 ms"
}
```

#### 4. Axe Accessibility Analysis
```http
POST /axe
Content-Type: application/json

{
  "url": "https://example.com"
}
```
**Response:**
```json
{
  "url": "https://example.com",
  "violations": [...],
  "passes": [...],
  "incomplete": [...]
}
```

#### 5. Full Analysis (Combined)
```http
POST /full-analysis
Content-Type: application/json

{
  "url": "https://example.com"
}
```
**Response:**
```json
{
  "url": "https://example.com",
  "lighthouse": {...},
  "puppeteer": {...},
  "axe": {...}
}
```

---


**Key Configuration:**
- **No-sandbox mode**: Required for containerized environments
- **Shared memory optimization**: `--disable-dev-shm-usage` flag
- **Headless operation**: All browsers run without GUI

---

## ☁️ Deployment

### Frontend (GitHub Pages)

```bash
cd frontend
npm run build

# Deploy to gh-pages branch
npm run deploy
```

### Backend (Google Cloud Run)

```bash
cd backend

# Build and push container
gcloud builds submit --tag gcr.io/equinoux-backend/backend .

# Deploy to Cloud Run
gcloud run deploy backend \
  --image gcr.io/equinoux-backend/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 5
```

**Why these settings?**
- **2Gi memory**: Chromium requires significant RAM
- **2 CPUs**: Improves analysis performance
- **300s timeout**: Some websites take time to load
- **min-instances 0**: Scales to zero when unused (cost-effective)
- **max-instances 10**: Handles traffic spikes

---

## 🎨 Design Philosophy

Equinoux embraces the **Frutiger Dark** aesthetic—a design trend that combines:
- **Glossy surfaces** and **depth** through gradients and shadows
- **Vibrant colors** with purpose (blues, purples, teals)
- **Playful elements** like the music player
- **Functional beauty** that doesn't sacrifice usability

**Why not flat minimalism?**  
While flat design has its place, Equinoux proves that tools can be both functional *and* delightful. The glossy, dimensional UI creates an engaging experience that makes website testing feel less like a chore and more like an exploration.

---

## 🎵 Music Player Features

The integrated music player adds personality to the analysis experience:

- **Curated Playlist**: Carefully selected background tracks
- **Random Playback**: Different song on each visit
- **Full Controls**: Play, pause, next, previous
- **Seek Functionality**: Click anywhere on the progress bar
- **Visual Feedback**: Animated play/pause states
- **Non-intrusive**: Complements the analysis workflow

---

## 🔒 Security & Privacy

- **No data storage**: URLs and results are never stored
- **CORS protection**: Only whitelisted origins can access the API
- **HTTPS enforced**: All production traffic is encrypted
- **Rate limiting**: Prevents abuse (handled by Cloud Run)
- **Sandboxed execution**: Chrome runs in isolated containers

---

## 💰 Cost Breakdown

### Frontend
- **Hosting**: $0 (GitHub Pages)
- **SSL**: $0 (Included)
- **CDN**: $0 (GitHub's infrastructure)

### Backend
- **Container Storage**: ~$0.05/month (GCR)
- **Compute**: Pay-per-use
  - 100 analyses/month: ~$0.20
  - 1,000 analyses/month: ~$2.00
  - 10,000 analyses/month: ~$15.00
- **Idle cost**: $0.00 (scales to zero)

**Total Monthly Cost (low usage)**: < $1

---

## 🐛 Troubleshooting

### Backend Issues

**"ECONNREFUSED" error:**
- Ensure Chromium is properly installed in the container
- Verify Chrome flags include `--no-sandbox` and `--disable-setuid-sandbox`

**"Frame was detached" error:**
- Increase memory allocation (min 2Gi recommended)
- Check timeout settings
- Verify the target website is accessible

**Cold start delays:**
- First request after idle period takes 3-5 seconds
- Consider setting `--min-instances 1` for instant responses (adds cost)

### Frontend Issues

**CORS errors:**
- Verify backend URL in frontend code
- Check CORS configuration in `app.js`
- Ensure domain is whitelisted

**Music player not loading:**
- Check audio file paths in `/assets`
- Verify files are included in build

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Lighthouse** - Google's web performance tool
- **Puppeteer** - Chrome DevTools Protocol automation
- **Axe-core** - Accessibility testing engine by Deque Systems
- **Google Cloud Run** - Serverless container platform
- **Frutiger Design** - Inspiration for the UI aesthetic

---

## 📧 Contact

- **GitHub**: [@nosoyunmarinero](https://github.com/nosoyunmarinero)
- **Project Link**: [https://github.com/nosoyunmarinero/equinoux](https://github.com/nosoyunmarinero/equinoux)
- **Live Demo**: [https://nosoyunmarinero.github.io/equinoux/](https://nosoyunmarinero.github.io/equinoux/)

**Made with 💙 and ✨ by nosoyunmarinero**

*"Because functional tools deserve to be beautiful too."*
