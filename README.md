# ⚡ Chargego — Powerbank Sharing Network

> **Problem Statement:** Travelers whose mobile phones die during sightseeing, shopping, or commuting face severe inconvenience because finding public electrical outlets for emergency charging is impossible. ChargeMate solves this by providing a widespread powerbank-sharing network with kiosk pickup/drop-off systems — similar to bike-sharing services.

| Metric | Score |
|---|---|
| Severity Score | 8 / 10 |
| TAM Score | 80 |
| Whitespace Score | 7 / 10 |
| Frequency Score | 6 / 10 |
| **ITCH Score** | **82.5** |

---

## 📁 Project Structure

```
chargego/
├── frontend/                  # React + Vite frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── features/          # Redux slices + feature logic
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer (Axios)
│   │   └── utils/             # Helper functions, constants
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/       # Route handler logic
│   │   ├── routes/            # Express route definitions
│   │   ├── models/            # Mongoose/Sequelize data models
│   │   ├── middleware/        # Auth, error handling, validation
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Helpers, constants, mailer
│   │   └── config/            # DB config, env config
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md                  # ← You are here
```

---

## 🚀 Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | Core framework + dev server |
| Tailwind CSS | Utility-first styling |
| MUI (Material UI) | Component library |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Formik + Yup | Forms & validation |
| React Helmet | SEO meta tags |
| React Hot Toast | Toast notifications |
| Socket.io-client | Real-time kiosk status |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Primary database |
| Redis | Session caching & rate limiting |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Socket.io | Real-time events |
| Stripe | Payments & deposits |
| Nodemailer | Email notifications |
| Multer + Cloudinary | File / image uploads |
| Joi | Request validation |
| Morgan + Winston | Logging |

---

## 🧠 Core Features & User Flows

### 1. Traveler (End User)
- Register / Login (email or Google OAuth)
- Browse nearby kiosks on an interactive map
- Scan QR code or select kiosk from map to rent a powerbank
- Real-time battery level indicator on rented powerbank
- Return powerbank at any kiosk (not just pickup point)
- Pay per hour / per charge cycle via Stripe
- View rental history and receipts
- Report damaged powerbank

### 2. Kiosk Admin / Operator
- Dashboard showing all kiosk locations
- Real-time slot availability per kiosk
- Alerts for low battery powerbanks needing re-stocking
- Revenue analytics per kiosk
- Maintenance request system

### 3. Super Admin
- Manage all kiosks, operators, and users
- Platform-wide analytics (revenue, churn, top locations)
- Manage pricing plans
- Content management (promotions, banners)

---

## ⚙️ Environment Variables

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:5000
```

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/chargemate
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/codinggita/charge_go
cd chargego
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy environment file and fill in values:

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

Seed the database with initial kiosk locations and admin user:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
# Server runs at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy environment file and fill in values:

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

Start the development server:

```bash
npm run dev
# App runs at http://localhost:5173
```

---

## 🗂️ Frontend — Detailed Folder Structure

```
frontend/src/
│
├── components/                   # Reusable, stateless UI components
│   ├── ui/
│   │   ├── Button.jsx            # Custom button with variants
│   │   ├── Input.jsx             # Controlled input with error display
│   │   ├── Modal.jsx             # Generic modal wrapper
│   │   ├── Card.jsx              # Content card container
│   │   ├── Badge.jsx             # Status badges (Available / Rented / Maintenance)
│   │   ├── Skeleton.jsx          # Loading skeleton variants
│   │   └── Toast.jsx             # Toast config wrapper
│   ├── layout/
│   │   ├── Navbar.jsx            # Top navigation with auth state
│   │   ├── Sidebar.jsx           # Admin dashboard sidebar
│   │   ├── Footer.jsx
│   │   └── ProtectedLayout.jsx   # Wraps protected pages
│   ├── map/
│   │   ├── KioskMap.jsx          # Google Maps with kiosk markers
│   │   ├── KioskMarker.jsx       # Custom map pin component
│   │   └── KioskInfoWindow.jsx   # Popup card on marker click
│   └── kiosk/
│       ├── KioskCard.jsx         # List view kiosk card
│       ├── SlotGrid.jsx          # Visual slot availability grid
│       └── PowerbankStatus.jsx   # Battery level indicator
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   ├── traveler/
│   │   ├── HomePage.jsx          # Map + nearby kiosks
│   │   ├── KioskDetailPage.jsx   # Single kiosk detail + rent action
│   │   ├── RentalPage.jsx        # Active rental status
│   │   ├── HistoryPage.jsx       # Past rentals
│   │   └── ProfilePage.jsx
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── KiosksPage.jsx        # All kiosks table
│   │   ├── KioskDetailAdmin.jsx  # Edit / manage kiosk
│   │   ├── UsersPage.jsx
│   │   └── AnalyticsPage.jsx
│   └── shared/
│       ├── NotFoundPage.jsx
│       └── UnauthorizedPage.jsx
│
├── features/                     # Redux Toolkit slices
│   ├── auth/
│   │   ├── authSlice.js          # user, token, isAuthenticated
│   │   └── authThunks.js        # login, register, logout async thunks
│   ├── kiosk/
│   │   ├── kioskSlice.js         # kiosks list, selected kiosk
│   │   └── kioskThunks.js       # fetchNearbyKiosks, fetchKioskById
│   ├── rental/
│   │   ├── rentalSlice.js        # activeRental, rentalHistory
│   │   └── rentalThunks.js
│   └── ui/
│       └── uiSlice.js            # isLoading, theme, sidebarOpen
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js                # Returns user + auth actions
│   ├── useDebounce.js            # Debounce input values
│   ├── useFetch.js               # Generic data fetching with loading/error
│   ├── useTheme.js               # Toggle + persist dark/light mode
│   ├── useGeolocation.js         # Browser geolocation API wrapper
│   └── useSocket.js              # Socket.io connection management
│
├── services/                     # Axios API service layer
│   ├── api.js                    # Axios instance + interceptors
│   ├── authService.js            # login, register, refreshToken
│   ├── kioskService.js           # getNearbyKiosks, getKioskById
│   ├── rentalService.js          # startRental, endRental, getHistory
│   └── paymentService.js         # createPaymentIntent, getReceipts
│
├── utils/
│   ├── storage.js                # localStorage / sessionStorage helpers
│   ├── formatters.js             # Date, currency, duration formatters
│   ├── validators.js             # Shared Yup schemas
│   └── constants.js             # App-wide constants (roles, status enums)
│
├── store/
│   └── store.js                  # Redux store configuration
│
├── router/
│   └── AppRouter.jsx             # All routes + route guards
│
├── theme/
│   ├── muiTheme.js               # MUI theme config (light + dark)
│   └── tailwindTokens.js         # Shared color/spacing tokens
│
├── App.jsx
└── main.jsx
```

---

## 🗂️ Backend — Detailed Folder Structure

```
backend/src/
│
├── config/
│   ├── db.js                     # MongoDB connection
│   ├── redis.js                  # Redis client setup
│   └── cloudinary.js             # Cloudinary config
│
├── models/
│   ├── User.js                   # User schema (traveler / admin / superadmin)
│   ├── Kiosk.js                  # Kiosk schema (location, slots, status)
│   ├── Powerbank.js              # Powerbank schema (battery, currentSlot, status)
│   ├── Rental.js                 # Rental transaction schema
│   ├── Payment.js                # Payment record schema
│   └── MaintenanceLog.js         # Kiosk maintenance reports
│
├── routes/
│   ├── auth.routes.js            # POST /auth/register, /auth/login, /auth/refresh
│   ├── user.routes.js            # GET /users/me, PATCH /users/me
│   ├── kiosk.routes.js           # GET /kiosks, GET /kiosks/:id, POST /kiosks (admin)
│   ├── rental.routes.js          # POST /rentals/start, POST /rentals/end, GET /rentals
│   ├── payment.routes.js         # POST /payments/intent, POST /payments/webhook
│   └── admin.routes.js           # Admin-only analytics and management routes
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── kiosk.controller.js
│   ├── rental.controller.js
│   ├── payment.controller.js
│   └── admin.controller.js
│
├── middleware/
│   ├── auth.middleware.js         # JWT verification
│   ├── role.middleware.js         # Role-based access (traveler, admin, superadmin)
│   ├── validate.middleware.js     # Joi request validation wrapper
│   ├── rateLimiter.middleware.js  # Redis-backed rate limiting
│   └── error.middleware.js        # Global error handler
│
├── services/
│   ├── auth.service.js            # Token generation, refresh logic
│   ├── kiosk.service.js           # Nearby kiosk geo-query, slot availability
│   ├── rental.service.js          # Rental lifecycle (start, active tracking, end)
│   ├── payment.service.js         # Stripe PaymentIntent, webhook handling
│   ├── email.service.js           # Nodemailer — receipts, OTPs, alerts
│   └── socket.service.js          # Socket.io event emitters (slot updates)
│
├── utils/
│   ├── ApiError.js                # Custom error class
│   ├── ApiResponse.js             # Standardized response wrapper
│   ├── asyncHandler.js            # try/catch wrapper for async controllers
│   ├── geoUtils.js                # Haversine distance, bounding box
│   └── logger.js                  # Winston logger config
│
└── validators/
    ├── auth.validator.js           # Joi schemas for auth routes
    ├── kiosk.validator.js
    └── rental.validator.js
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api/v1`

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/google` | Public | Google OAuth login |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Auth | Invalidate token |
| POST | `/auth/forgot-password` | Public | Send OTP to email |
| POST | `/auth/reset-password` | Public | Reset password with OTP |

### Kiosks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/kiosks?lat=&lng=&radius=` | Public | Get nearby kiosks |
| GET | `/kiosks/:id` | Public | Get kiosk details + slot availability |
| POST | `/kiosks` | Admin | Create new kiosk |
| PATCH | `/kiosks/:id` | Admin | Update kiosk info |
| DELETE | `/kiosks/:id` | SuperAdmin | Remove kiosk |

### Rentals

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/rentals/start` | Auth | Begin rental (kioskId, slotId) |
| POST | `/rentals/end` | Auth | Return powerbank (kioskId, slotId) |
| GET | `/rentals/active` | Auth | Get current active rental |
| GET | `/rentals/history` | Auth | Paginated rental history |
| GET | `/rentals/:id` | Auth | Single rental detail + receipt |

### Payments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/payments/intent` | Auth | Create Stripe PaymentIntent |
| POST | `/payments/webhook` | Stripe | Handle payment events |
| GET | `/payments/receipts` | Auth | List all receipts |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/analytics` | Admin | Platform analytics |
| GET | `/admin/users` | Admin | All users (paginated) |
| PATCH | `/admin/users/:id/ban` | Admin | Ban/unban user |
| GET | `/admin/powerbanks` | Admin | All powerbank statuses |
| POST | `/admin/maintenance` | Admin | Log maintenance event |

---

## 🗄️ Database Models

### User
```js
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: Enum['traveler', 'admin', 'superadmin'],
  googleId: String,
  avatar: String,
  phone: String,
  stripeCustomerId: String,
  isEmailVerified: Boolean,
  isBanned: Boolean,
  createdAt, updatedAt
}
```

### Kiosk
```js
{
  name: String,               // "Terminal 3 - Gate 22"
  location: {
    type: 'Point',
    coordinates: [lng, lat]   // GeoJSON for geospatial queries
  },
  address: String,
  city: String,
  country: String,
  totalSlots: Number,
  slots: [{
    slotNumber: Number,
    powerbank: ObjectId (ref Powerbank) | null,
    status: Enum['available', 'occupied', 'charging', 'maintenance']
  }],
  operatorId: ObjectId (ref User),
  isActive: Boolean,
  images: [String],
  createdAt, updatedAt
}
```

### Powerbank
```js
{
  serialNumber: String (unique),
  batteryLevel: Number (0–100),
  currentKiosk: ObjectId (ref Kiosk),
  currentSlot: Number,
  status: Enum['available', 'rented', 'charging', 'damaged', 'retired'],
  totalCycles: Number,
  lastCheckedAt: Date,
  createdAt, updatedAt
}
```

### Rental
```js
{
  user: ObjectId (ref User),
  powerbank: ObjectId (ref Powerbank),
  pickupKiosk: ObjectId (ref Kiosk),
  pickupSlot: Number,
  returnKiosk: ObjectId (ref Kiosk) | null,
  returnSlot: Number | null,
  startTime: Date,
  endTime: Date | null,
  durationMinutes: Number | null,
  status: Enum['active', 'completed', 'cancelled'],
  payment: ObjectId (ref Payment) | null,
  createdAt, updatedAt
}
```

### Payment
```js
{
  user: ObjectId (ref User),
  rental: ObjectId (ref Rental),
  stripePaymentIntentId: String,
  amount: Number,             // in paise/cents
  currency: String,           // 'inr', 'usd'
  status: Enum['pending', 'succeeded', 'failed', 'refunded'],
  receiptUrl: String,
  createdAt, updatedAt
}
```

---

## 🔄 Real-Time Events (Socket.io)

The frontend connects to the socket server on mount via `useSocket` hook.

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `kiosk:slot_updated` | `{ kioskId, slots[] }` | Slot availability changed |
| `rental:started` | `{ rentalId, powerbank }` | Rental confirmed |
| `rental:ended` | `{ rentalId, receipt }` | Return confirmed |
| `powerbank:low_battery` | `{ powerbankId, level }` | Admin alert |

---

## 🎨 Frontend Implementation Notes

### Routing Setup (`router/AppRouter.jsx`)

```jsx
// Public routes: /login, /register, /kiosks (browse only)
// Protected routes: /rent, /rental/active, /history, /profile
// Admin routes: /admin/dashboard, /admin/kiosks, /admin/users
// Role guard: redirect to /unauthorized if role mismatch
// All protected routes use React.lazy() for code splitting
```

### Redux Store Shape

```js
{
  auth: {
    user: { id, name, email, role, avatar },
    token: String,
    isAuthenticated: Boolean,
    isLoading: Boolean,
    error: String | null
  },
  kiosk: {
    nearby: [],
    selected: null,
    isLoading: Boolean,
    error: null
  },
  rental: {
    active: null,
    history: [],
    isLoading: Boolean
  },
  ui: {
    theme: 'light' | 'dark',
    isSidebarOpen: Boolean,
    globalLoader: Boolean
  }
}
```

### localStorage Strategy (`utils/storage.js`)

```js
// Persistent (localStorage)
storage.set('theme', 'dark')
storage.set('authToken', token)
storage.set('userPrefs', { mapZoom: 13 })

// Session-only (sessionStorage)
storage.session.set('rentalStep', 2)       // multi-step flow progress
storage.session.set('kioskFilter', filters) // temporary map filters

// Clear on logout
storage.clearAll()  // clears both localStorage and sessionStorage auth data
```

### Custom Hooks

```js
// useGeolocation — requests browser location, returns { lat, lng, error }
// useSocket — connects to socket server, auto-disconnects on unmount
// useAuth — returns { user, isAuthenticated, login, logout }
// useDebounce — debounces search input for kiosk name search
// useFetch — generic hook for data fetching with loading/error/data state
// useTheme — returns { theme, toggleTheme }, persists to localStorage
```

---

## 💳 Pricing Model

| Plan | Rate | Details |
|---|---|---|
| Pay-per-use | ₹10 / hour | Billed per hour, max ₹80/day |
| Deposit | ₹200 | Refunded on successful return |
| Lost/Damaged | ₹500 | Charged if powerbank not returned within 48 hrs |

Pricing is configurable via the Admin panel and stored in the database.

---

## 🔐 Security Checklist

- JWT access token (15 min expiry) + refresh token (7 days) rotation
- HTTP-only cookies for refresh token storage
- bcrypt password hashing (salt rounds: 12)
- Rate limiting on auth endpoints (10 req/15 min per IP via Redis)
- Joi input validation on all POST/PATCH routes
- Role-based middleware on all protected routes
- Stripe webhook signature verification
- CORS restricted to frontend origin
- Helmet.js for HTTP security headers
- No sensitive data in localStorage (only non-sensitive preferences)

---

## 📊 SEO Implementation (Frontend)

Each page sets its own meta via React Helmet:

```jsx
// HomePage
<title>ChargeMate — Find a Powerbank Near You</title>
<meta name="description" content="Rent a powerbank from a nearby kiosk in seconds. Available at airports, malls, and transit hubs across India." />

// KioskDetailPage
<title>{kiosk.name} — ChargeMate Kiosk</title>

// Open Graph tags on all pages
<meta property="og:image" content="/og-banner.png" />
<meta property="og:type" content="website" />
```

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test           # Vitest unit tests
npm run test:e2e       # Playwright end-to-end tests

# Backend
cd backend
npm run test           # Jest unit tests
npm run test:integration  # Integration tests with test DB
```

---

## 📦 Build & Deployment

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
# Output: dist/ — upload to Vercel or Netlify
```

### Backend (Railway / Render / EC2)

```bash
cd backend
npm run build          # Transpile if using TypeScript
npm start              # Production server
```

### Docker (Optional)

```bash
docker-compose up --build
# Spins up: backend + MongoDB + Redis
```

---

## 🗺️ Roadmap

- [x] Core rental flow (rent → return → pay)
- [x] Real-time kiosk availability
- [x] Stripe payment integration
- [ ] NFC tap-to-rent support
- [ ] Loyalty points / referral program
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Operator mobile app (React Native)
- [ ] IoT integration with physical kiosk hardware
- [ ] Dynamic pricing (surge during peak hours)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ⚡ to keep travelers connected.*
