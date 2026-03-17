<div align="center">

<img src="https://img.shields.io/badge/BrainBridge-AI%20Screening-1A237E?style=for-the-badge&logoColor=white" />

# 🧠 BrainBridge

### AI-Powered Behavioral Screening for Early Cognitive Risk Indicators in Children

**The only free, gamified, multilingual learning disability screener built for India**

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-80.6%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-15.4%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-1.2%25-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Hackathon 2025](https://img.shields.io/badge/Hackathon-2025-FF6B6B?style=flat-square)](https://github.com/abhiabhishekoffl/BrainBridge-1)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML%20Service-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)

<br/>

[**Live Demo**](https://brainbridge.vercel.app) · [**Documentation**](docs/) · [**Report Bug**](https://github.com/abhiabhishekoffl/BrainBridge-1/issues) · [**Request Feature**](https://github.com/abhiabhishekoffl/BrainBridge-1/issues)

<br/>

> ⚠️ **Medical Disclaimer:** BrainBridge provides **behavioral screening indicators only**. It is not a medical diagnostic system and does not replace professional clinical assessment.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Reference](#-api-reference)
  - [Authentication](#authentication-endpoints)
  - [Session](#session-endpoints)
  - [Telemetry](#telemetry-endpoints)
  - [ML Prediction](#ml-prediction-endpoint)
  - [Reports](#report-endpoints)
- [ML Pipeline](#-ml-pipeline)
  - [Models](#models)
  - [Feature Engineering](#feature-engineering)
  - [Training](#training-your-own-models)
- [Games](#-cognitive-mini-games)
- [Database Schema](#-database-schema)
- [Government Integration](#-government-scheme-integration)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

BrainBridge is a **free** gamified AI behavioral screening tool that detects early cognitive risk indicators for **Dyslexia**, **Dyscalculia**, and **ADHD** in children aged **3–12 years**.

Children play 3 short mini-games (4 questions each). While they play, the system silently captures **multiple behavioral signals**, engineers them into feature vectors, and runs **3 independent ML classifiers in parallel** — delivering risk assessments in **under few seconds**, on any smartphone, in **multiple Indian languages**, at **₹0 cost**.

```
Child plays game (2 min)
        ↓
React captures raw events (taps, timing, errors)
        ↓
Node.js engineers multiple behavioral features
        ↓
FastAPI runs 3 ML models in parallel (<200ms)
        ↓
Risk scores → Parent Report + Teacher Dashboard + Specialist Finder
```

| Metric | Value |
|--------|-------|
| 🎯 Target Age | 3–12 years |
| 🧩 Mini-Games | 3 (Letter Mirror · Focus Catcher · Number Jump) |
| 📊 Behavioral Signals | multiple per session |
| 🤖 ML Models | 3 independent classifiers |
| ⚡ Inference Time | < few seconds |
| 🌐 Languages | multiple Indian languages |
| 💰 Cost to Families | ₹0 |
| 📱 Hardware Required | Any device with internet connection |

---

## 🔴 The Problem

> **4.5 crore Indian children have a learning disability — 90% go undetected until it's too late.**

| Statistic | Value |
|-----------|-------|
| Children with learning disabilities in India | 4.5 Crore+ |
| Undiagnosed until age 12+ | 90% |
| Private diagnosis cost | ₹25,000 |
| Psychiatrist-to-child ratio | 1 : 2,00,000 |
| School dropout rate (undetected LDs) | 4× higher |

The brain's **neuroplasticity peaks between ages 3–12**. Interventions during this window are **3–5× more effective** than at age 12+. Yet no free, accessible, multilingual tool exists for early screening in India.

---

## ✨ Key Features

### 🎮 Gamified Screening
Children play short games — not clinical tests. Stars, sounds, and colors make it feel like play while AI captures behavioral signals in the background.

### 🤖 3 Independent ML Models
Each disorder has its own purpose-built classifier trained on clinically-grounded synthetic data:
- **Random Forest** → Dyslexia (handles correlated phonics/visual signals)
- **XGBoost** → Dyscalculia (captures non-linear numerical thresholds)
- **SVM (RBF kernel)** → ADHD (optimal boundary for continuous attention signals)

### 🌐 Language-Native AI
Not just a translated UI — the Sound Pattern Game uses **language-specific phoneme sets** for each of the 10 supported Indian languages.

### 🔒 Ethics-First by Design
- Anonymous Child IDs only — no real names stored
- Trained on **50,000 synthetic profiles** — no real child data
- **DPDP Act 2023** compliant
- Output always says "recommend assessment" — never "diagnosis"
- AES-256 encryption in transit and at rest

### 📊 Three-Stakeholder Output
One session generates three distinct outputs:
| Output | For | Key Info |
|--------|-----|----------|
| Parent Report | Parents | GREEN/YELLOW/RED + plain language advice |
| Teacher Dashboard | Teachers | Anonymous class heatmap + counsellor flag |
| Specialist Finder | All | 3 nearest free/affordable assessment centres |

### 🏛️ Government Scheme Integration
Direct integration pathway with DIKSHA, DISHA, Samagra Shiksha, NEP 2020, and UDISE+.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT — Next.js                            │
│  Letter Mirror Game · Focus Catcher Game · Number Jump Game     │
│  IndexedDB (offline) · i18next (multiple languages) · HTML5 Canvas   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ JWT · telemetry payload (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY — Node.js + Express                    │
│  /auth  /session  /telemetry  /predict  /report                 │
│  JWT middleware · Rate limiting · Helmet.js · CORS              │
└────────┬─────────────────┬───────────────────────┬─────────────┘
         │                 │                       │
         ▼                 ▼                       ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│   MongoDB    │  │     Redis        │  │  FastAPI ML Service  │
│  Atlas       │  │  Session cache   │  │                      │
│  users       │  │  Rate limits     │  │  Random Forest       │
│  sessions    │  │  JWT blacklist   │  │  XGBoost             │
│  telemetry   │  │  Event buffer    │  │  SVM (RBF)           │
│  results     │  └──────────────────┘  │  < 200ms inference   │
└──────────────┘                        └──────────────────────┘
```

### Data Flow

```
Child plays game
    → React.js logs raw events (tap · timing · error · sequence)
    → Node.js Feature Engineering (20+ computed signals)
    → FastAPI receives 3 separate feature arrays
    → 3 ML models run in parallel
    → Age-normalised probability scores returned
    → Traffic light classification (GREEN / YELLOW / RED)
    → Report generated via Puppeteer
    → Saved to MongoDB results collection
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with SSR |
| TypeScript | Type safety |
| HTML5 Canvas | Game rendering |
| Howler.js | Audio (language-native phonemes) |
| i18next | Internationalisation (10 languages) |
| IndexedDB | Offline game session storage |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API server |
| JWT (jsonwebtoken) | Authentication |
| bcrypt | Password hashing (salt=12) |
| MongoDB Atlas | Primary database |
| Redis | Session cache + rate limiting |
| Puppeteer | PDF report generation |
| Leaflet.js | Specialist finder map |
| Helmet.js | Security headers |

### ML Service
| Technology | Purpose |
|------------|---------|
| Python 3.10+ | Runtime |
| FastAPI | ML API server |
| scikit-learn | Random Forest + SVM |
| XGBoost | Dyscalculia model |
| Pydantic | Input validation |
| pandas / numpy | Feature engineering |
| pickle | Model serialisation |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend deployment |
| Railway | Backend + ML service |
| MongoDB Atlas (free) | Database |
| Redis Cloud (free) | Cache |

---

## 📁 Project Structure

```
BrainBridge-1/
├── brainbridge-frontend/          # Next.js application
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/             # Login page
│   │   │   └── register/          # Register page
│   │   ├── dashboard/
│   │   │   ├── parent/            # Parent dashboard
│   │   │   └── teacher/           # Teacher dashboard
│   │   ├── games/
│   │   │   ├── letter-mirror/     # Dyslexia game
│   │   │   ├── focus-catcher/     # ADHD game
│   │   │   └── number-jump/       # Dyscalculia game
│   │   └── report/                # Results & specialist finder
│   ├── components/
│   │   ├── games/                 # Game components
│   │   ├── ui/                    # Shared UI components
│   │   └── dashboard/             # Dashboard components
│   ├── lib/
│   │   ├── telemetry.ts           # Event capture engine
│   │   ├── offline.ts             # IndexedDB sync
│   │   └── i18n/                  # Language files (10 langs)
│   └── public/
│
├── brainbridge-backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js            # POST /auth/register, /auth/login
│   │   │   ├── session.js         # POST /session/start
│   │   │   ├── telemetry.js       # POST /telemetry/ingest
│   │   │   ├── predict.js         # POST /predict (calls FastAPI)
│   │   │   └── report.js          # GET /report/:sessionId
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verify middleware
│   │   │   └── rateLimit.js       # express-rate-limit
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   ├── Session.js         # Session schema
│   │   │   ├── Telemetry.js       # Telemetry schema
│   │   │   └── Result.js          # Results schema
│   │   ├── services/
│   │   │   ├── featurePipeline.js # Feature engineering
│   │   │   ├── riskCalculator.js  # Score → traffic light
│   │   │   └── reportGenerator.js # Puppeteer PDF
│   │   └── utils/
│   │       └── redis.js           # Redis client
│   └── server.js
│
├── ml/                            # Python FastAPI ML service
│   ├── api/
│   │   └── main.py                # FastAPI app
│   ├── config/
│   │   └── constants.py           # Age weights, thresholds
│   ├── games/
│   │   └── schemas.py             # Pydantic input schemas
│   ├── features/
│   │   ├── letter_mirror_features.py
│   │   ├── focus_catcher_features.py
│   │   └── number_jump_features.py
│   ├── models/
│   │   ├── schemas.py             # Model input classes
│   │   ├── train_all.py           # Training script
│   │   ├── dyslexia_model.pkl     # Trained RF model
│   │   ├── dyscalculia_model.pkl  # Trained XGBoost model
│   │   └── adhd_model.pkl         # Trained SVM model
│   ├── pipeline/
│   │   └── feature_pipeline.py    # Master pipeline
│   ├── data/
│   │   └── generate_datasets.py   # Synthetic data generator
│   └── tests/
│       └── test_pipeline.py
│
├── .gitignore
├── package.json
├── README.md
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
python >= 3.10
mongodb (Atlas or local)
redis (Cloud or local)
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/abhiabhishekoffl/BrainBridge-1.git
cd BrainBridge-1
```

**2. Install frontend dependencies**

```bash
cd brainbridge-frontend
npm install
```

**3. Install backend dependencies**

```bash
cd ../brainbridge-backend
npm install
```

**4. Install ML service dependencies**

```bash
cd ../ml
pip install fastapi uvicorn scikit-learn xgboost pandas numpy pydantic pickle5
```

### Environment Variables

**`brainbridge-backend/.env`**

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/brainbridge

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Encryption
AES_SECRET_KEY=your_aes_256_key_here
```

**`brainbridge-frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=BrainBridge
```

**`ml/.env`**

```env
MODEL_DIR=models/
API_HOST=0.0.0.0
API_PORT=8000
```

### Running Locally

**Step 1 — Generate synthetic training data and train models**

```bash
cd ml
python data/generate_datasets.py    # generates 3 CSVs (5000 rows each)
python models/train_all.py          # trains & saves 3 .pkl files
python tests/test_pipeline.py       # verify pipeline
```

**Step 2 — Start ML service**

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
# Docs available at http://localhost:8000/docs
```

**Step 3 — Start backend**

```bash
cd ../brainbridge-backend
npm run dev
# API running at http://localhost:5000
```

**Step 4 — Start frontend**

```bash
cd ../brainbridge-frontend
npm run dev
# App running at http://localhost:3000
```

**Or use Docker Compose**

```bash
docker-compose up --build
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <jwt_token>`

---

### Authentication Endpoints

#### `POST /auth/register`

Register a new parent or teacher account.

```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body**

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "SecurePass@123",
  "role": "parent"
}
```

**Response `201`**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "6507f1f77bcf86cd799439011",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "parent"
  }
}
```

---

#### `POST /auth/login`

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body**

```json
{
  "email": "priya@example.com",
  "password": "SecurePass@123"
}
```

**Response `200`**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "6507f1f77bcf86cd799439011",
    "role": "parent"
  }
}
```

---

#### `POST /auth/refresh`

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

```json
{ "refreshToken": "eyJhbGci..." }
```

---

#### `POST /auth/logout` 🔒

Blacklists the current JWT in Redis.

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

### Session Endpoints

#### `POST /session/start` 🔒

```http
POST /api/v1/session/start
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "childAge": 5,
  "language": "hindi",
  "consentGiven": true
}
```

**Response `201`**

```json
{
  "sessionId": "sess_abc123xyz",
  "childId": "child_anon_7f3a2b",
  "expiresAt": "2025-01-01T12:30:00Z"
}
```

---

#### `GET /session/:sessionId` 🔒

Get session status and completion rate.

---

### Telemetry Endpoints

#### `POST /telemetry/ingest` 🔒

Ingests raw game events from the frontend.

```http
POST /api/v1/telemetry/ingest
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "sessionId": "sess_abc123xyz",
  "game": "letter_mirror",
  "completionRate": 1.0,
  "events": [
    {
      "questionId": 1,
      "shownLetter": "b",
      "selectedLetter": "d",
      "timeMs": 1900,
      "wasSkipped": false
    },
    {
      "questionId": 2,
      "shownLetter": "p",
      "selectedLetter": "p",
      "timeMs": 850,
      "wasSkipped": false
    }
  ]
}
```

**Response `200`**

```json
{
  "success": true,
  "telemetryId": "tel_9f3b2a1c",
  "buffered": true
}
```

---

### ML Prediction Endpoint

#### `POST /predict` 🔒

The main AI inference endpoint. Runs all 3 ML models in parallel.

```http
POST /api/v1/predict
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "sessionId": "sess_abc123xyz",
  "childAge": 5,
  "language": "hindi",
  "sessionCompletionRate": 1.0,
  "letterMirror": {
    "letterReversalRate": 0.50,
    "mirrorReversalRate": 0.45,
    "phoneticDecodingAccuracy": 0.50,
    "responseTimeMs": 1900,
    "responseTimeNormalised": 1.80,
    "responseTimeVariability": 420,
    "selfCorrectionRate": 0.15,
    "hesitationRate": 0.55,
    "skipRate": 0.00
  },
  "focusCatcher": {
    "attentionPersistenceScore": 28.5,
    "attentionDecayRate": 0.60,
    "impulsivityRate": 0.55,
    "reactionTimeAvgMs": 1700,
    "reactionTimeVariability": 480,
    "reactionTimeNormalised": 1.75,
    "taskSwitchErrorRate": 0.58,
    "taskSwitchAccuracy": 0.38,
    "overallAccuracy": 0.40,
    "skipRate": 0.00
  },
  "numberJump": {
    "quantityEstimationError": 0.45,
    "quantityEstimationAccuracy": 0.38,
    "digitReversalRate": 0.50,
    "digitVsDotsGap": 0.35,
    "numberComparisonAccuracy": 0.40,
    "countingSpeedRatio": 1.90,
    "responseTimeVariability": 380,
    "subitizingAccuracy": 0.35,
    "skipRate": 0.00
  }
}
```

**Response `200`**

```json
{
  "sessionId": "sess_abc123xyz",
  "dyslexia": {
    "score": 68.4,
    "risk": "YELLOW",
    "ageAdjustedScore": 51.3,
    "ageAdjustedRisk": "YELLOW"
  },
  "dyscalculia": {
    "score": 24.1,
    "risk": "GREEN",
    "ageAdjustedScore": 18.1,
    "ageAdjustedRisk": "GREEN"
  },
  "adhd": {
    "score": 71.2,
    "risk": "RED",
    "ageAdjustedScore": 53.4,
    "ageAdjustedRisk": "YELLOW"
  },
  "confidence": "HIGH",
  "inferenceMs": 143.2,
  "disclaimer": "Behavioral insights only. Not a medical diagnostic system."
}
```

**Error Responses**

| Code | Description |
|------|-------------|
| `400` | Invalid feature values or missing fields |
| `401` | JWT token missing or expired |
| `422` | Session completion rate too low (< 50%) — ask child to retry |
| `429` | Rate limit exceeded |
| `500` | ML service unavailable |

---

### Report Endpoints

#### `GET /report/:sessionId` 🔒

```http
GET /api/v1/report/sess_abc123xyz
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "reportId": "rep_xyz789",
  "sessionId": "sess_abc123xyz",
  "childAge": 5,
  "language": "hindi",
  "scores": {
    "dyslexia": { "score": 68.4, "risk": "YELLOW" },
    "dyscalculia": { "score": 24.1, "risk": "GREEN" },
    "adhd": { "score": 71.2, "risk": "RED" }
  },
  "recommendations": [...],
  "nearestCentres": [...],
  "pdfUrl": "/reports/sess_abc123xyz.pdf",
  "generatedAt": "2025-01-01T10:30:00Z",
  "disclaimer": "This tool provides behavioral insights only..."
}
```

#### `GET /report/:sessionId/pdf` 🔒

Returns downloadable PDF report (Puppeteer-generated).

---

#### `GET /dashboard/teacher` 🔒 `role: teacher`

Returns anonymous class-wide screening heatmap.

```json
{
  "totalScreened": 24,
  "completionRate": 0.87,
  "riskDistribution": {
    "dyslexia": { "green": 16, "yellow": 6, "red": 2 },
    "dyscalculia": { "green": 20, "yellow": 3, "red": 1 },
    "adhd": { "green": 14, "yellow": 8, "red": 2 }
  },
  "flaggedForReview": 3
}
```

---

### Health Check

#### `GET /health`

```json
{
  "status": "ok",
  "version": "1.0.0",
  "services": {
    "mongodb": "connected",
    "redis": "connected",
    "mlService": "connected",
    "modelsLoaded": 3
  },
  "uptime": 3600
}
```

---

## 🤖 ML Pipeline

### Models

| Model | Disorder | Algorithm | Features | Training Data |
|-------|----------|-----------|----------|---------------|
| `dyslexia_model.pkl` | Dyslexia | Random Forest (200 trees) | 9 | 5,000 synthetic profiles |
| `dyscalculia_model.pkl` | Dyscalculia | XGBoost (200 rounds) | 9 | 5,000 synthetic profiles |
| `adhd_model.pkl` | ADHD | SVM RBF (C=10) | 10 | 5,000 synthetic profiles |

### Feature Engineering

Each game's raw events are transformed into clinically meaningful features:

**Letter Mirror → Dyslexia Features (9)**
```
letter_reversal_rate · mirror_reversal_rate · phonetic_decoding_accuracy
response_time_ms · response_time_normalised · response_time_variability
self_correction_rate · hesitation_rate · skip_rate
```

**Focus Catcher → ADHD Features (10)**
```
attention_persistence_score · attention_decay_rate · impulsivity_rate
reaction_time_avg_ms · reaction_time_variability · reaction_time_normalised
task_switch_error_rate · task_switch_accuracy · overall_accuracy · skip_rate
```

**Number Jump → Dyscalculia Features (9)**
```
quantity_estimation_error · quantity_estimation_accuracy · digit_reversal_rate
digit_vs_dots_gap · number_comparison_accuracy · counting_speed_ratio
response_time_variability · subitizing_accuracy · skip_rate
```

### Score Calculation

```
predict_proba() → probability (0–1)
      ↓ × 100
raw score (0–100)
      ↓ × age_weight
age-adjusted score
      ↓ confidence check
final score
      ↓ threshold
🟢 0–30 (LOW)  🟡 30–65 (MONITOR)  🔴 65–100 (REFER)
```

**Age Normalisation Weights**
| Age | Weight | Rationale |
|-----|--------|-----------|
| 3 | 0.50 | Errors developmentally normal |
| 4 | 0.65 | Early development stage |
| 5 | 0.75 | Approaching school readiness |
| 6 | 0.90 | Most skills should emerge |
| 7 | 1.00 | Full baseline sensitivity |

### Training Your Own Models

```bash
cd ml

# 1. Generate synthetic datasets (based on clinical baselines)
python data/generate_datasets.py
# Creates: data/dyslexia_dataset.csv
#          data/dyscalculia_dataset.csv
#          data/adhd_dataset.csv

# 2. Train all 3 models
python models/train_all.py
# Outputs: models/dyslexia_model.pkl
#          models/dyscalculia_model.pkl
#          models/adhd_model.pkl

# 3. Test the pipeline
python tests/test_pipeline.py

# 4. Start the ML API
uvicorn api.main:app --reload --port 8000

# 5. View interactive API docs
open http://localhost:8000/docs
```

---

## 🎮 Cognitive Mini-Games

### 🪞 Letter Mirror Game — Dyslexia Screening

Child sees a letter (`b`, `d`, `p`, `q`) and selects the matching one.

| Parameter | Value |
|-----------|-------|
| Questions | 4 per session |
| Duration | 90 seconds |
| Signals | letter_reversal_rate, phonetic_decoding_accuracy, response_time_ms... |
| Scientific Basis | Phonological Awareness Tests (NICHD) |

### 🎯 Focus Catcher Game — ADHD Screening

Child taps a moving target; task switches mid-game to test executive function.

| Parameter | Value |
|-----------|-------|
| Questions | 4 per session |
| Duration | 90 seconds |
| Signals | attention_persistence_score, impulsivity_rate, reaction_time_variability... |
| Scientific Basis | Stop-Signal Task (Barkley 2014) |

### 🐸 Number Jump Game — Dyscalculia Screening

Child picks the larger of two quantities (shown as digits or dot groups).

| Parameter | Value |
|-----------|-------|
| Questions | 4 per session |
| Duration | 60 seconds |
| Signals | quantity_estimation_error, digit_reversal_rate, subitizing_accuracy... |
| Scientific Basis | Weber Fraction (Halberda 2008) |

---

## 🗄️ Database Schema

### `users` collection

```javascript
{
  _id: ObjectId,
  email: String,           // hashed with bcrypt
  password: String,        // bcrypt hash, salt=12
  name: String,
  role: "parent" | "teacher",
  createdAt: Date,
  updatedAt: Date
}
```

### `sessions` collection

```javascript
{
  _id: ObjectId,
  sessionId: String,       // UUID
  childId: String,         // anonymous ID
  userId: ObjectId,        // ref: users
  childAge: Number,        // 3–7
  language: String,
  status: "active" | "completed" | "abandoned",
  completionRate: Number,
  consentGiven: Boolean,
  createdAt: Date
}
```

### `telemetry` collection

```javascript
{
  _id: ObjectId,
  sessionId: String,
  game: "letter_mirror" | "focus_catcher" | "number_jump",
  rawEvents: Array,        // array of question events
  processedFeatures: Object,
  createdAt: Date
}
```

### `results` collection

```javascript
{
  _id: ObjectId,
  sessionId: String,
  dyslexia:    { score: Number, risk: "GREEN"|"YELLOW"|"RED" },
  dyscalculia: { score: Number, risk: "GREEN"|"YELLOW"|"RED" },
  adhd:        { score: Number, risk: "GREEN"|"YELLOW"|"RED" },
  confidence: "HIGH" | "MEDIUM" | "LOW",
  inferenceMs: Number,
  disclaimer: String,
  createdAt: Date
}
```

---

## 🏛️ Government Scheme Integration

BrainBridge is designed to plug into India's existing education and health infrastructure:

| Scheme | Ministry | Integration |
|--------|----------|-------------|
| **DIKSHA** | Education | Games embeddable · Teacher Dashboard linked · 25 Cr students |
| **DISHA** | Social Justice | Digital front door · Specialist Finder lists all DISHA centres |
| **Samagra Shiksha** | Education | Fills gap of 1.5 lakh vacant special educator posts |
| **NEP 2020** | Education | Play-based ✓ · Multilingual ✓ · Age 3–7 ✓ · AI-driven ✓ |
| **UDISE+** | Education | Provides disorder-specific data currently missing from UDISE+ |
| **PM e-Vidya** | Education | Works on any smartphone · zero extra hardware |

---

## 🗺️ Roadmap

- [x] Core game engine (Letter Mirror, Focus Catcher, Number Jump)
- [x] Feature engineering pipeline
- [x] 3 ML classifiers (Random Forest, XGBoost, SVM)
- [x] FastAPI ML service
- [x] Risk aggregator (riskCalculator.js)
- [x] JWT authentication (login + register)
- [x] Parent report + Teacher dashboard
- [x] Specialist finder (Leaflet.js map)
- [x] Offline support (IndexedDB)
- [ ] **V2 — 3 Months**
  - [ ] All 10 Indian languages live
  - [ ] WhatsApp bot integration
  - [ ] Autism screening module
  - [ ] 50 government school pilots
  - [ ] Real data model retraining
  - [ ] OAuth (Google / DigiLocker)
- [ ] **V3 — 6 Months**
  - [ ] DIKSHA platform integration
  - [ ] Live teleconsultation (₹99)
  - [ ] NGO API partnerships
  - [ ] State government contracts
  - [ ] School-level analytics dashboards
  - [ ] Docker + Kubernetes deployment

---

## 🤝 Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, no logic change
refactor: Code change, no feature/fix
test:     Adding missing tests
chore:    Build process or tooling
```

---

## 👥 Team

**Team BrainBridge — Hackathon 2025**

| Member | Role |
|--------|------|
| [@abhiabhishekoffl](https://github.com/abhiabhishekoffl) | Full Stack + ML |

---

## ⚠️ Ethical Statement

BrainBridge is a **behavioral screening tool**, not a medical diagnostic system.

- All outputs are framed as risk indicators requiring professional follow-up
- No personally identifiable information is stored
- All AI training used **synthetic data only** — no real child data
- Fully compliant with **India's DPDP Act 2023**
- Parent/guardian consent is required before any screening begins

> *"This platform provides early behavioral screening indicators. It does not replace professional medical or psychological evaluation. If BrainBridge indicates elevated risk, please consult a qualified specialist."*

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

- Clinical baselines: Shaywitz (2003), Halberda (2008), Barkley (2014), Leth-Steensen (2000)
- [DIKSHA Platform](https://diksha.gov.in/) — Ministry of Education, India
- [DISHA Scheme](https://thenationaltrust.gov.in/) — National Trust, India
- [DPDP Act 2023](https://www.meity.gov.in/) — Ministry of Electronics and IT

---

<div align="center">

**🧠 BrainBridge · Free · Open Source · Built for Bharat**

*Let's give every child the start they deserve.*

<br/>

[![GitHub stars](https://img.shields.io/github/stars/abhiabhishekoffl/BrainBridge-1?style=social)](https://github.com/abhiabhishekoffl/BrainBridge-1/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/abhiabhishekoffl/BrainBridge-1?style=social)](https://github.com/abhiabhishekoffl/BrainBridge-1/network/members)

</div>
