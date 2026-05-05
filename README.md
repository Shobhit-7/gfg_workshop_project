# AI Resume Analyzer (Google Cloud + Antigravity)

A modern AI-powered web application that analyzes resumes and provides a score along with improvement suggestions.

---

## 🌐 Live Demo
👉 https://resume-analyzer-221293707187.us-central1.run.app/

---

## ✨ Features

- 📄 Upload Resume (PDF)
- 🤖 AI-based Resume Scoring (0–100)
- 📊 Skill & Experience Extraction
- 💡 Improvement Suggestions
- ⚡ FastAPI Backend
- 🌐 Deployed on Google Cloud Run
- 🐳 Dockerized Application

---

## 🛠 Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: FastAPI (Python)  
- Deployment: Google Cloud Run  
- Containerization: Docker  

---

## ⚙️ How it Works

1. User uploads a resume  
2. Backend extracts text  
3. AI logic analyzes keywords  
4. Generates:
   - Score  
   - Suggestions  
   - Skills  

---

## 📦 Installation (Local Setup)

```bash
git clone https://github.com/Shobhit-7/gfg_workshop_project.git
cd gfg_workshop_project
pip install -r requirements.txt
uvicorn main:app --reload
