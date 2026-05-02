<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00F7FF,100:0057FF&height=200&section=header&text=⚡%20ChargeGo&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Smart%20Powerbank%20Sharing%20Platform&descAlignY=58&descColor=c0f0ff" />

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00F7FF&center=true&vCenter=true&width=700&lines=Find+Nearby+Powerbanks+⚡;Scan+QR+%26+Rent+Instantly+📱;Smart+Charging%2C+Anywhere+🚀;Full+Stack+Web+Application+💯" />
</p>

<p align="center">
  <a href="https://charge-go.netlify.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_App-00C853?style=for-the-badge&logo=netlify&logoColor=white" />
  </a>
  &nbsp;
  <a href="https://github.com/ShahArpanPratikkumar/charge_go">
    <img src="https://img.shields.io/badge/GitHub-View_Code-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" />
</p>

<br/>

</div>

---

## 🧠 Overview

**ChargeGo** is a full-stack powerbank-sharing platform that lets users find nearby charging stations, rent a powerbank with a single QR scan, use it on the go, and return it at any station — all billed through an in-app wallet.

> No more low-battery anxiety while commuting, traveling, or exploring.

---

## 🎯 Problem Statement

| ❌ Problem | ✅ ChargeGo Solution |
|---|---|
| Phone dies while traveling | Rent a powerbank at any nearby station |
| No charger or outlet nearby | Return at any location, not just where you rented |
| Complicated rental flows | Scan → Rent → Go — done in seconds |
| Cash-only systems | Seamless in-app wallet payments |

---

## 🔄 User Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Sign Up / Login                                       │
│        ↓                                                │
│   Browse Map  →  Find Nearest Station                   │
│        ↓                                                │
│   Scan QR Code  →  Confirm Rental                       │
│        ↓                                                │
│   Use Powerbank Anywhere  🔋                            │
│        ↓                                                │
│   Return at Any Station                                 │
│        ↓                                                │
│   Auto Billed via Wallet  💳                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 🔐 | **Authentication** | Secure login & signup with JWT |
| 📍 | **Station Finder** | Interactive map showing nearby stations |
| 🔋 | **QR Rental** | Scan to rent a powerbank instantly |
| 💳 | **Wallet System** | In-app balance for seamless payments |
| 📊 | **Dashboard** | Track rentals, activity & history |
| 📱 | **Responsive UI** | Optimized for mobile & desktop |

---

## 🏗️ Architecture

```
┌────────────────┐      HTTP/REST      ┌────────────────┐      Mongoose      ┌────────────────┐
│                │  ─────────────────► │                │  ────────────────► │                │
│  React + Vite  │                     │ Node + Express │                     │    MongoDB     │
│   (Frontend)   │  ◄───────────────── │   (Backend)    │  ◄──────────────── │   (Database)   │
│                │      JSON Data      │                │      Documents      │                │
└────────────────┘                     └────────────────┘                     └────────────────┘
      │                                       │
  Netlify                                  Render
 (Deployed)                              (Deployed)
```

---

## 📂 Project Structure

```
charge_go/
│
├── 📁 frontend/
│   ├── public/
│   └── src/
│       ├── 🧩 components/       # Reusable UI components
│       ├── 📄 pages/            # Route-level pages
│       ├── 🔗 context/          # Global state (Context API)
│       ├── 🌐 services/         # API service calls
│       └── 🎨 assets/           # Images, icons, styles
│
├── 📁 backend/
│   ├── ⚙️  config/              # DB & env configuration
│   ├── 🎮 controllers/         # Business logic
│   ├── 🛣️  routes/              # API route definitions
│   ├── 🗃️  models/              # Mongoose schemas
│   ├── 🔒 middleware/           # Auth & error handlers
│   └── 🚀 server.js            # App entry point
│
└── 📄 README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|------------|------|
| **React** | Component-based UI framework |
| **Vite** | Lightning-fast build tool |
| **React Router** | Client-side routing |
| **Context API** | Global state management |

### Backend
| Technology | Role |
|------------|------|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **JWT** | Secure authentication tokens |
| **Mongoose** | MongoDB ODM |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database |
| **Netlify** | Frontend deployment |
| **Render** | Backend hosting |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShahArpanPratikkumar/charge_go.git
cd charge_go
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
npm start
```

> Frontend runs on `http://localhost:5173` · Backend runs on `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_super_secret_key

# CORS
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Reference

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Get current user profile |

### Rental Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rental/start` | Start a powerbank rental |
| `POST` | `/api/rental/end` | End rental & process payment |

---

## 🔮 Roadmap

- [ ] 🗺️ Real-time station availability tracking
- [ ] 💰 Razorpay / Stripe payment gateway
- [ ] 🛡️ Admin dashboard for station management
- [ ] 📲 Push notifications for rental status
- [ ] 🌐 Multi-language support
- [ ] 📱 React Native mobile app

---

## 👨‍💻 Author

<div align="center">

**Shah Arpan Pratikkumar**

<a href="https://github.com/ShahArpanPratikkumar">
  <img src="https://img.shields.io/badge/GitHub-ShahArpanPratikkumar-181717?style=for-the-badge&logo=github" />
</a>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0057FF,100:00F7FF&height=120&section=footer" />

<sub>⚡ Built with passion by Shah Arpan Pratikkumar · ChargeGo © 2025</sub>

</div>

- Added system improvement phase #1 on May 02, 2026

- Added system improvement phase #2 on May 02, 2026

- Added system improvement phase #3 on May 02, 2026

- Added system improvement phase #4 on May 02, 2026

- Added system improvement phase #5 on May 02, 2026

- Added system improvement phase #6 on May 02, 2026

- Added system improvement phase #7 on May 02, 2026

- Added system improvement phase #8 on May 02, 2026

- Added system improvement phase #1 on May 02, 2026

- Added system improvement phase #2 on May 02, 2026

- Added system improvement phase #3 on May 02, 2026

- Added system improvement phase #4 on May 02, 2026

- Added system improvement phase #5 on May 02, 2026

- Added system improvement phase #6 on May 02, 2026

- Added system improvement phase #7 on May 02, 2026
