# KaushalLens AI

> **SIH26246: Labour Market Intelligence & Skill Demand-Supply Forecasting Engine**  
> *A Policy Decision Engine for India's Skilling Ecosystem*

---

## 🎯 Executive Summary
**KaushalLens AI** is a decision-intelligence platform that continuously fuses labour-market demand, workforce supply, training capacity, industry signals, and economic indicators to forecast district-level skill shortages or saturation, quantify confidence, and recommend exactly where government bodies (MSDE, NCVET, State Skill Missions, NSDC) should increase, reduce, relocate, or redesign training capacity.

### What Makes KaushalLens Distinct
- ❌ Not another generic job portal
- ❌ Not another static dashboard
- ❌ Not another generic ML model
- ✅ **A policy decision and intervention engine** with actionable lead-time warnings, evidence chains, and ROI impact models.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────────────┐
                               │             Multi-Source Data Fusion           │
                               │  NCS • PLFS • e-Shram • ASI • SID • NCO • NQR  │
                               └───────────────────────┬────────────────────────┘
                                                       │
                               ▼                       ▼                       ▼
                     ┌──────────────────┐   ┌──────────────────┐   ┌───────────────────┐
                     │  Demand Signals  │   │  Supply Signals  │   │ Training Capacity │
                     │ Vacancies, Macro │   │ PLFS, Graduates, │   │ ITI, PMKVY, DGT,  │
                     │  Factory Capex   │   │ e-Shram Reserves │   │ Private SSC Hubs  │
                     └─────────┬────────┘   └─────────┬────────┘   └─────────┬─────────┘
                               │                      │                      │
                               └──────────────────────┼──────────────────────┘
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │    Ensemble Forecast Engine │
                                       │ LightGBM + ARIMA + Holt-W. │
                                       │  Confidence Bound ± 4.2%   │
                                       └──────────────┬──────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       ▼                              ▼                              ▼
             ┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐
             │ 5-Stage Early     │          │ Policy Simulator  │          │ AI Policy Analyst │
             │ Warning System    │          │ CapEx/OpEx Trade- │          │ Multi-Source RAG  │
             │ Chokepoint Alerts │          │ off & ROI Engine  │          │ Evidence Engine   │
             └───────────────────┘          └───────────────────┘          └───────────────────┘
```

---

## ✨ Core Modules & Decision Screens

1. **National Intelligence Dashboard**: Macro shortage (2.8M) vs. oversupply (1.4M), district risk distributions, and urgent intervention queues.
2. **District Intelligence Drilldown**: Geospatial granular analytics across 724 districts (Hosur, Coimbatore, Chennai, Bengaluru, Pune, etc.).
3. **Skill Demand-Supply Gap Matrix**: Dynamic net gap indexing mapped to NCO occupational codes and NSQF levels.
4. **4-Quarter Ensemble Forecast Engine**: Historical trajectories vs. predictive horizons with 95% confidence intervals and backtesting metrics.
5. **Interactive Policy Simulator**: Real-time modeling of EV/Solar seat allocations, budget redistribution, and multidimensional radar trade-off metrics.
6. **Training Capacity Optimizer**: Specific centre-level reallocation recommendations (Expand, Convert, Right-Size).
7. **5-Stage Early Warning System**: Detection of impending skill bottlenecks up to 6 months before industrial chokepoints occur.
8. **Curriculum Drift Detector**: Automated comparison of NCVET/NQR Qualification Packs against live market demands.
9. **Emerging Skills Radar**: Cluster tracking of nascent high-velocity capabilities across sectors.
10. **Closed-Loop Outcome Tracker**: Continuous auditing of policy interventions comparing predicted vs. actual placement outcomes.
11. **AI Policy Analyst (RAG)**: Conversational reasoning assistant citing verifiable national data sources.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js (ESM), Express 4, Helmet, Rate Limiter, Compression, Morgan
- **Database & Storage**: PostgreSQL / Supabase ready, JSON Mock Layer
- **Architecture**: Decoupled Client-Server with Vite API Proxy

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/JoseSamuvel/KaushalLens-AI.git
cd KaushalLens-AI
```

### 2. Run the Backend API
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000
# Health check: http://localhost:5000/health
```

### 3. Run the Frontend Application
```bash
cd ../frontend
npm install --legacy-peer-deps
npm run dev
# Application starts at http://localhost:5173
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/districts` | List all district intelligence profiles |
| `GET` | `/api/districts/:id` | Detailed district profile with health score |
| `GET` | `/api/occupations` | Occupational taxonomy with NSQF levels |
| `GET` | `/api/skill-gaps` | Net demand-supply gap calculations |
| `GET` | `/api/forecast` | Ensemble model forecast with confidence intervals |
| `GET` | `/api/recommendations`| Actionable policy interventions |
| `GET` | `/api/training` | ITI and PMKVY training centres |
| `GET` | `/api/early-warning` | 5-stage bottleneck warning alerts |
| `POST`| `/api/simulator/run` | Dynamic policy scenario simulation |
| `POST`| `/api/ai-analyst/query`| RAG policy analyst query engine |

---

## 📄 License
This project is licensed under the MIT License.
