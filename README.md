# BrainBridge

## AI Bilingual Learning Disability Screening Platform

---

# 1. Project Overview

**BrainBridge** is a gamified AI-powered screening platform designed to detect early indicators of learning disabilities in children aged **4–8 years**.

The system evaluates behavioral signals through short interactive games and applies machine learning models to estimate risk for:

* Dyslexia
* Dyscalculia
* ADHD

BrainBridge is designed to be:

* Accessible
* Affordable
* Multilingual
* Deployable in schools and homes

It provides **screening indicators**, not medical diagnoses.

---

# 2. Problem Statement

Learning disabilities are widespread yet underdiagnosed.

### Key Statistics

* Over **4.5 crore children in India** are estimated to have learning disabilities.
* **90% remain undiagnosed until age 10+**.
* Professional assessments cost **₹20,000–₹25,000**.

### Key Challenges

1. Late detection of learning disorders
2. Expensive clinical evaluations
3. Lack of screening tools for schools
4. Language barriers in existing platforms
5. Limited access to specialists

---

# 3. Proposed Solution

BrainBridge provides a **digital screening system** where children play simple games while the system measures cognitive behavior.

The system collects **20+ behavioral signals**, processes them using machine learning models, and generates a **risk report**.

### Key Characteristics

* Gamified interaction
* Bilingual support
* Offline compatibility
* AI-based screening
* Parent-friendly reports

---

# 4. Target Users

### Primary Users

* Children (4–8 years)
* Parents
* Teachers

### Secondary Users

* Schools
* NGOs
* Pediatric psychologists
* Government programs

---

# 5. Platform Features

## 5.1 Bilingual Interface

Supported languages:

* English
* Hindi

Future expansion:

* Bengali
* Tamil
* Telugu
* Marathi
* Gujarati
* Kannada
* Malayalam
* Punjabi
* Odia

### Localization System

* `en.json`
* `hi.json`

Features:

* UI translation
* bilingual audio instructions
* persistent language settings

---

# 6. Screening Game System

Each screening session includes **five short games** lasting **60–90 seconds**.

Total screening time:

**7–10 minutes**

---

# 7. Screening Games

## 7.1 Letter Mirror Game

Screens for **Dyslexia**.

Child identifies the correct letter among mirrored versions.

Signals collected:

* mirror confusion rate
* letter recognition accuracy
* response latency
* correction attempts

---

## 7.2 Sound Pattern Game

Screens for **phonological processing issues**.

Child matches sounds with letters.

Signals collected:

* phoneme recognition
* auditory discrimination delay
* sound mapping errors

---

## 7.3 Number Jump Game

Screens for **Dyscalculia**.

Child jumps to the correct number or quantity.

Signals collected:

* number ordering errors
* counting mistakes
* quantity estimation
* response delay

---

## 7.4 Focus Catcher Game

Screens for **ADHD**.

Child catches targets while ignoring distractions.

Signals collected:

* impulsive clicks
* missed targets
* sustained attention
* distraction reaction

---

## 7.5 Drawing Sequence Game

Measures **working memory and executive function**.

Child repeats a sequence of drawing movements.

Signals collected:

* memory accuracy
* sequence completion
* motor planning delay

---

# 8. Behavioral Telemetry System

BrainBridge captures behavioral data silently during gameplay.

### Signals Collected

| Signal          | Meaning                    |
| --------------- | -------------------------- |
| Reaction Time   | Cognitive processing speed |
| Error Rate      | Mistake frequency          |
| Hesitation Time | Decision difficulty        |
| Tap Precision   | Motor coordination         |
| Pattern Errors  | Cognitive confusion        |
| Task Completion | Persistence                |

---

# 9. AI / Machine Learning System

## 9.1 Data Pipeline

```text
Game Interaction
↓
Telemetry Collection
↓
Feature Engineering
↓
Machine Learning Model
↓
Risk Prediction
↓
Parent Report
```

---

## 9.2 Machine Learning Models

| Disorder    | Model               |
| ----------- | ------------------- |
| ADHD        | Random Forest       |
| Dyslexia    | CNN / Random Forest |
| Dyscalculia | XGBoost             |

---

## 9.3 Model Output

Models output probability scores.

Example:

```
ADHD Risk = 0.71
Dyslexia Risk = 0.32
Dyscalculia Risk = 0.45
```

These are mapped to the **traffic light system**.

---

# 10. Risk Classification

| Score   | Risk                   |
| ------- | ---------------------- |
| 0–0.3   | Green (Low Risk)       |
| 0.3–0.6 | Yellow (Moderate Risk) |
| 0.6–1   | Red (High Risk)        |

---

# 11. Parent Report

The parent receives a simple report containing:

* overall risk indicator
* strengths & weaknesses
* behavioral observations
* recommended next steps

Example sections:

* attention skills
* reading skills
* number understanding

---

# 12. Teacher Dashboard

Teachers can view:

* class-wide screening results
* anonymized student profiles
* early intervention suggestions

---

# 13. Specialist Finder

Parents can locate nearby:

* child psychologists
* speech therapists
* special educators

---

# 14. System Architecture

## Frontend

Framework:

* Next.js / React

Libraries:

* TailwindCSS
* Framer Motion
* Zustand / Redux
* Phaser.js or Canvas API

---

## Backend

Backend server:

* Node.js / Express

Responsibilities:

* telemetry storage
* authentication
* report generation

---

## ML Service

Separate ML microservice.

Framework:

* FastAPI

Responsibilities:

* feature processing
* prediction API
* model loading

---

## Database

Primary database:

PostgreSQL

Stores:

* child sessions
* telemetry signals
* screening results

Cache:

Redis

---

# 15. Prediction API

Example endpoint:

```
POST /predict
```

Input:

```json
{
  "reaction_time": 1.2,
  "error_rate": 0.35,
  "attention_score": 0.61,
  "math_accuracy": 0.55
}
```

Output:

```json
{
  "adhd_risk": 0.71,
  "dyslexia_risk": 0.32,
  "dyscalculia_risk": 0.45
}
```

---

# 16. Offline Support

Offline functionality uses:

* Service Workers
* IndexedDB

Features:

* offline gameplay
* local telemetry storage
* automatic sync

---

# 17. Privacy & Compliance

BrainBridge follows **DPDP Act 2023**.

Privacy measures:

* anonymous child IDs
* minimal data storage
* encrypted communication
* no third-party trackers

---

# 18. Ethical Policy

BrainBridge is a **screening tool**, not a diagnostic system.

Reports always include:

> “This platform provides early screening indicators.
> It does not replace professional medical evaluation.”

---

# 19. Development Roadmap

## Phase 1

Frontend prototype.

* bilingual UI
* game skeletons
* telemetry capture

---

## Phase 2

ML system integration.

* dataset cleaning
* model training
* prediction API

---

## Phase 3

Reporting system.

* parent report
* teacher dashboard
* PDF export

---

## Phase 4

Scaling features.

* specialist finder
* mobile PWA
* multi-language support

---

# 20. Missing Components

The following components still need development.

### Dataset alignment

Game signals must match dataset features.

### Feature engineering

Telemetry → ML features.

### Model training pipeline

Training scripts and evaluation.

### Model evaluation

Accuracy, recall, precision.

### Deployment system

Docker containers and cloud hosting.

---

# 21. Performance Targets

| Metric                 | Goal        |
| ---------------------- | ----------- |
| Session Completion     | >75%        |
| Crash Free Sessions    | >98%        |
| Average Screening Time | <10 minutes |

---

# 22. Repository Structure

```
brainbridge/

frontend/
games/
backend/
ml_service/
datasets/
docs/
```

---

# 23. Future Expansion

Possible future modules:

* speech disorder detection
* handwriting analysis
* autism screening signals
* adaptive learning recommendations

---

# 24. License

Educational and research use.

---

# 25. Authors

BrainBridge Development Team
#   B r a i n B r i d g e  
 