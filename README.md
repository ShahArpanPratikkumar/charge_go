<h1 align="center">⚡ ChargeGo</h1>
<h3 align="center">Smart Powerbank Sharing Platform</h3>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&pause=1000&color=00F7FF&center=true&vCenter=true&width=650&lines=Find+Nearby+Powerbanks+⚡;Scan+QR+%26+Rent+Instantly+📱;Smart+Charging+Solution+🚀;Full+Stack+Web+Application+💯" />
</p>

<p align="center">
  <a href="https://charge-go.netlify.app/">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Visit App-00C853?style=for-the-badge&logo=netlify&logoColor=white" />
  </a>
  <a href="https://github.com/ShahArpanPratikkumar/charge_go">
    <img src="https://img.shields.io/badge/GitHub Repository-View Code-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

## 🧠 Project Overview  

ChargeGo is a full-stack web application that provides a smart powerbank-sharing system.  
Users can find nearby stations, scan QR codes to rent powerbanks, and return them at any location.

---

## 🎯 Problem Statement  

People often face low battery issues while traveling or commuting.  
ChargeGo solves this by enabling users to rent powerbanks anytime, anywhere.

---

## 🔄 User Flow  

```text
Login / Signup
   ↓
Find Nearby Station
   ↓
Scan QR Code
   ↓
Rent Powerbank
   ↓
Use Anywhere
   ↓
Return Powerbank
   ↓
Payment via Wallet

⚡ Features
🔐 Authentication (Login / Signup)
📍 Nearby Station Finder (Map)
🔋 QR Code-based Rental
💳 Wallet System
📊 Dashboard & Activity
📱 Responsive UI


🏗️ Architecture
Frontend (React) → Backend (Node.js) → Database (MongoDB)
📂 Project Structure
charge_go/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md
🛠️ Tech Stack

Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB

Deployment:
Frontend → Netlify
Backend → Render

🚀 Setup
git clone https://github.com/ShahArpanPratikkumar/charge_go.git
cd charge_go
Frontend
cd frontend
npm install
npm run dev
Backend
cd backend
npm install
npm start


🔐 Environment Variables
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173


📡 API Example
POST /api/auth/login
POST /api/auth/register
GET  /api/user/profile
POST /api/rental/start
POST /api/rental/end


💡 Future Scope
Real-time tracking
Payment integration
Admin dashboard
Live station updates


👨‍💻 Author

Shah Arpan Pratikkumar
