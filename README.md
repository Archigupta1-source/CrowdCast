# 🚀 CrowdCast

> AI-Powered Real-Time Audience Engagement Platform

CrowdCast is a full-stack web application that enables presenters to create interactive presentations and engage audiences in real time. 
With AI-powered presentation generation, live polls, Word Clouds, and Open Text questions, CrowdCast transforms traditional presentations into interactive experiences.

---

## 🌐 Live Demo

🔗 **Frontend:** https://crowd-cast-sooty.vercel.app

💻 **Backend:** https://amusing-analysis-production-a05d.up.railway.app


---

## ✨ Features

- 🤖 AI-powered presentation generation
- 📊 Live MCQ Polls
- ☁️ Word Cloud interactions
- 💬 Open Text questions
- ⚡ Real-time audience responses using WebSockets
- 👨‍🏫 Presenter & Audience modes
- 🔐 JWT Authentication
- 📱 Responsive UI
- 🎨 Modern UI with Spline 3D & smooth scroll animations
- 🌐 Fully deployed on Vercel & Railway

---
### Live Results

(Add Screenshot)

---

## 🛠 Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Spline 3D
- Chart.js

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- WebSockets

### AI

- OpenRouter API
- Google Gemma Model

### Deployment

- Vercel
- Railway

---

## 🏗 Architecture

```
                +--------------------+
                |     React App      |
                +---------+----------+
                          |
                    REST API (Axios)
                          |
                +---------v----------+
                |    Express Server  |
                +---------+----------+
                          |
          +---------------+----------------+
          |                                |
     MongoDB                      OpenRouter API
          |
    Presentation Data

WebSocket Server
       ↑
Presenter ↔ Audience
```

---


## 🎯 Future Improvements

- AI Presentation Templates
- AI Quiz Generator
- PDF & PPT Export
- Live Analytics Dashboard
- Presentation Themes
- Presenter Notes
- Collaborative Editing
- QR Code Room Joining
- Voice-Controlled Presentation

---

## 💡 Key Learnings

While building CrowdCast, I gained hands-on experience with:

- Full-stack application architecture
- WebSocket communication
- JWT Authentication
- REST API design
- MongoDB & Mongoose
- AI API integration
- Production deployment
- Debugging real-world deployment issues
- React Router configuration
- Environment variables & production workflows

---

## 👨‍💻 Author

**Archi Gupta**

LinkedIn: https://linkedin.com/in/your-profile

GitHub: https://github.com/Archigupta1-source

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!



