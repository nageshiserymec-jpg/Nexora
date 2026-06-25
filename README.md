# 🎓 Nexora – AI-Powered Career Guidance Platform

<div align="center">

![Nexora Banner](https://img.shields.io/badge/Nexora-Career%20Guidance%20AI-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)

**An intelligent career guidance system for Class 10th and 12th students using AI-powered RAG chatbot and Gemini AI.**

</div>

---

## 🌟 Features

- 🤖 **AI Career Guidance** – Personalized career roadmaps using Google Gemini AI
- 💬 **RAG Chatbot** – Ask questions about your career report using an intelligent RAG-based chatbot
- 🎯 **Class 10th Guidance** – Stream selection and career paths after 10th
- 🎓 **Class 12th Guidance** – College recommendations, entrance exams, and career paths after 12th
- 🔐 **User Authentication** – Secure login/signup with JWT tokens
- 📊 **College Predictor** – Predict colleges based on your profile
- 📋 **Quick Summary** – AI-generated summary of your career report
- 🌙 **Dark Mode Design** – Beautiful glassmorphism UI

---

## 🏗️ Architecture

```
Nexora/
├── Frontend/          # React + Vite (Port 5173)
├── Backend/           # Node.js + Express (Port 5001)
└── Chatbot/           # Python FastAPI + LangChain RAG (Port 5002)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, TailwindCSS, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB, JWT, Bcrypt |
| **Chatbot** | Python, FastAPI, LangChain, FAISS, HuggingFace |
| **AI Models** | Google Gemini 2.5 Flash, OpenRouter (Gemma 4) |
| **Database** | MongoDB Atlas |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas account
- Google AI Studio API Key
- OpenRouter API Key

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nageshiserymec-jpg/Nexora.git
cd Nexora
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```

Start the backend:

```bash
npm run dev
```

> Backend runs at `http://localhost:5001`

---

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_CHATBOT_URL=http://localhost:5002
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

### 4️⃣ Chatbot Setup (Python RAG Server)

```bash
cd Chatbot
python -m venv venv
.\venv\Scripts\Activate.ps1     # Windows
# source venv/bin/activate      # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `Chatbot/` folder:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Start the chatbot:

```bash
python main.py
```

> Chatbot API runs at `http://localhost:5002`

---

## 🔑 API Keys

| Key | Where to Get |
|-----|-------------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `OPENROUTER_API_KEY` | [OpenRouter](https://openrouter.ai/keys) |
| `MONGO_URI` | [MongoDB Atlas](https://cloud.mongodb.com) |

---

## 📡 API Endpoints

### Backend (Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login user |
| `POST` | `/predict` | Generate Class 10th career guidance |
| `POST` | `/predict-12th` | Generate Class 12th career guidance |
| `POST` | `/summarize` | Summarize career report |
| `GET` | `/result` | Get college predictor results |

### Chatbot (Port 5002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/store-guidance` | Store user career guidance for RAG |
| `POST` | `/chat` | Chat with AI about your career report |
| `GET` | `/chat-history/{session_id}` | Retrieve chat history |
| `GET` | `/health` | Health check |

---

## 📸 Screenshots

> _Add screenshots of your application here_

---

## 🗺️ How It Works

```
Student fills interests → Backend calls Gemini AI → Career report generated
        ↓
Report sent to Chatbot RAG server → Stored as vector embeddings
        ↓
Student asks questions → Chatbot retrieves relevant context → AI answers
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nagesh** – [@nageshiserymec-jpg](https://github.com/nageshiserymec-jpg)

---

<div align="center">
Made with ❤️ for students across India 🇮🇳
</div>
