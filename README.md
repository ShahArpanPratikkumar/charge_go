<h1 align="center">⚡ ChargeGo</h1>
<h3 align="center">Smart Powerbank Sharing Platform</h3>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&pause=1000&color=00F7FF&center=true&vCenter=true&width=650&lines=Find+Nearby+Powerbanks+⚡;Scan+QR+%26+Rent+Instantly+📱;Real+Time+Smart+Charging+🚀;Full+Stack+Production+Ready+App+💯" />
</p>

<p align="center">
  <a href="https://charge-go.netlify.app/">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Open App-00C853?style=for-the-badge&logo=netlify&logoColor=white" />
  </a>
  <a href="https://github.com/ShahArpanPratikkumar/charge_go">
    <img src="https://img.shields.io/badge/GitHub Repository-View Code-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

## 🧠 What is ChargeGo?

ChargeGo is a **real-world full-stack solution** for the problem of mobile battery drain.  

👉 Users can:
- 📍 Find nearby powerbank stations  
- 🔋 Scan QR to rent instantly  
- 💳 Pay via wallet  
- 🔁 Return at any station  

➡️ Just like **bike-sharing**, but for charging 🔥

---

## 🎬 Live Demo

👉 https://charge-go.netlify.app/

---

## ⚡ Core Features (At a Glance)

| Feature | Description |
|--------|------------|
| 🔐 Authentication | Secure Login / Signup |
| 📍 Map System | Find nearest stations |
| 🔋 QR Scanner | Instant powerbank rental |
| 💳 Wallet | Payment & transactions |
| 📊 Dashboard | User activity tracking |
| 📱 Responsive | Works on all devices |

---



## 🔄 Complete User Flow (IMPORTANT)

```text
charge_go/
│
├── frontend/                # React + Vite Frontend
│   ├── public/              # Static assets (icons, images)
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Scanner, etc.)
│   │   ├── pages/           # App pages (Home, Map, Profile, Rent, etc.)
│   │   ├── context/         # Global state management
│   │   ├── services/        # API calls
│   │   └── assets/          # Images & media
│   ├── index.html
│   └── package.json
│
├── backend/                 # Node.js + Express Backend
│   ├── config/              # DB & Passport config
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # Auth, upload, etc.
│   ├── server.js            # Entry point
│   └── package.json
│
└── README.md
User Login → Find Station → Scan QR → Rent Powerbank → Use → Return → Payment Done
