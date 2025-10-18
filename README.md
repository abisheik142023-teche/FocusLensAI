# FocusLensAI — AI-Powered Employee Performance Monitoring System

## 1️⃣ Project Overview
FocusLensAI is an AI-driven system that monitors employee performance and provides mentoring insights. It tracks work patterns in real-time, predicts burnout, measures focus and productivity, and offers personalized suggestions.

**Key Features:**
- Real-time dashboards for employees & managers  
- Hybrid evaluation (AI + manager feedback)  
- Predictive well-being insights  
- Scalable architecture suitable for small to large teams  

---

## 2️⃣ Problem Statement
Traditional employee reviews are:  
- Manual and biased → slow & inaccurate  
- Reactive → feedback comes too late  
- One-size-fits-all → no personalization  
- Low transparency → employees don’t trust scores  

**Goal:** Provide real-time, unbiased, actionable insights with ethical, data-driven performance monitoring.

---

## 3️⃣ Objectives
- Track employee activities automatically  
- Generate AI-driven metrics (productivity, burnout, focus)  
- Provide personalized improvement suggestions  
- Support hybrid & remote teams  
- Ensure privacy and compliance with data protection  
- Integrate with existing HR tools  

---

## 4️⃣ Existing Solutions
| Tool       | Key Features                | Issues / Disadvantages               |
|-----------|-----------------------------|------------------------------------|
| ActivTrak | Time tracking, app usage     | ❌ No burnout prediction, ❌ Limited AI insights, ❌ Not personalized |
| EmpMonitor| Attendance logs, app tracking| ❌ Privacy concerns, ❌ Minimal real-time feedback, ❌ Limited dashboards |
| Hubstaff  | Activity tracking, screenshots | ❌ Intrusive monitoring, ❌ Post-facto reports, ❌ Low trust |
| Teramind  | Behavioral analytics, alerts | ❌ Complex setup, ❌ High cost, ❌ Security-focused |
| Time Doctor| Time usage, tasks, payroll  | ❌ Generic AI scores, ❌ No personalized suggestions, ❌ Limited predictive analytics |

---

## 5️⃣ How FocusLensAI Solves These Issues
| Issue             | FocusLensAI Improvement                                   |
|------------------|----------------------------------------------------------|
| No predictive AI  | ✅ Predicts burnout, focus, productivity trends          |
| Limited personalization | ✅ Personalized recommendations per employee      |
| Privacy concerns  | ✅ Encrypted data and opt-in tracking                     |
| Post-facto reporting | ✅ Real-time dashboards with live updates              |
| Low trust         | ✅ Explainable AI shows how scores are calculated        |
| Scalability       | ✅ Modular architecture for small → large teams          |

---

## 6️⃣ Advantages
- Real-time Monitoring: Apps, tasks, communication  
- AI-Powered Accuracy: Reduces human bias  
- Data-Driven Decisions: Supports promotions & training  
- Employee Growth: Personalized skill improvement feedback  
- Hybrid Evaluation: AI + manager ensures fairness  
- Gamified Engagement: Motivates employees  
- Scalable Architecture: Small teams → enterprises  

---

## 7️⃣ Limitations
- Privacy concerns → employees may feel monitored  
- Initial setup requires data collection  
- AI predictions depend on data quality  
- Creativity and soft skills cannot be fully measured  
- Resistance to adoption & change  

**Mitigations:** Encrypted storage, pre-built models, hybrid evaluation, training & demo sessions.

---

## 8️⃣ AI Models Used
| Model             | Task                      | Description                                    |
|------------------|---------------------------|------------------------------------------------|
| Random Forest     | Active vs Idle Classification | High accuracy, simple implementation         |
| XGBoost           | Burnout Prediction         | Predicts stress trends using historical data |
| BERT (simplified) | Sentiment Analysis         | NLP on messages/emails                        |
| Isolation Forest  | Anomaly Detection          | Detects unusual patterns                      |
| Collaborative Filter | Personalized Tips       | Suggests productivity actions per employee   |

> Models retrain weekly to adapt to changing patterns.

---

## 9️⃣ Technology Stack
- **Frontend:** HTML, CSS, JavaScript, Chart.js  
- **Backend:** Node.js + Express + JWT Authentication  
- **Database:** MongoDB  
- **AI Engine:** Python + FastAPI + scikit-learn  
- **Tracking:** Electron/Desktop APIs  
- **Hosting:** Local server or free-tier cloud (Heroku / Render)  
- **Security:** SSL, JWT, encrypted storage  

---

## 🔟 System Architecture
[Tracker Agent] → [Backend API] → [MongoDB] → [AI Engine (FastAPI)] → [Dashboard UI]

yaml
Copy code
- Frontend: Interactive dashboards  
- Backend: REST APIs with JWT auth  
- Database: Stores logs, metrics, predictions  
- AI Engine: Predicts productivity, focus, burnout  

---

## 1️⃣1️⃣ Database Schema (MongoDB)
```javascript
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  appUsed: String,
  activeTime: Number,
  idleTime: Number,
  keystrokes: Number,
  sentimentScore: Number,
  productivityLabel: String,
  focusScore: Number,
  burnoutRisk: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);
