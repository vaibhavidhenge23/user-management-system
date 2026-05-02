# 🛡️ User Management System

A full-stack **MERN** web application for managing user accounts with role-based access control (RBAC), secure JWT authentication, and a clean, responsive UI.

---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| Frontend | `https://your-app.vercel.app` |
| Backend API | `https://your-api.onrender.com` |

> **Test Credentials:**
> | Role | Email | Password |
> |------|-------|----------|
> | Admin | admin@example.com | admin123 |
> | Manager | manager@example.com | manager123 |
> | User | user@example.com | user123 |

---

## ✨ Features

### 🔐 Authentication
- JWT-based login with access token + refresh token
- Passwords hashed with bcrypt (salt rounds: 12)
- Protected API routes — unauthorized requests return `401/403`
- Inactive users cannot log in

### 👥 Role-Based Access Control (RBAC)

| Feature | Admin | Manager | User |
|---------|:-----:|:-------:|:----:|
| View all users | ✅ | ✅ | ❌ |
| Create user | ✅ | ❌ | ❌ |
| Edit any user | ✅ | ✅ (non-admin) | ❌ |
| Delete/deactivate user | ✅ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |

### 📋 User Management
- Paginated, searchable user list
- Filter by role and status
- Create users with auto-generated or custom passwords
- Soft delete (deactivate) — users cannot log in when inactive
- Full audit trail: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

### 🎨 Frontend
- Role-based navigation (links shown/hidden by role)
- Route protection on client side
- Clean, responsive UI with dark navbar

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| State Management | React Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh tokens) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
user-management-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # login, register, refresh, me
│   │   └── userController.js      # CRUD + profile
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── rbacMiddleware.js      # Role-based access
│   ├── models/
│   │   └── User.js                # Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── validators/
│   │   └── userValidator.js       # express-validator rules
│   ├── seed/
│   │   └── seed.js                # Seed script
│   ├── .env.example
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── UserList.jsx
        │   ├── UserForm.jsx
        │   ├── UserDetail.jsx
        │   └── Profile.jsx
        ├── services/
        │   └── api.js             # Axios API calls
        └── App.jsx
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free M0 tier)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/user-management-system.git
cd user-management-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/usermanagement?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
```

Run the server:

```bash
npm run dev
```

Seed the database:

```bash
npm run seed
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| GET | `/api/auth/me` | Protected | Get current user |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin, Manager | Get all users (paginated) |
| POST | `/api/users` | Admin | Create user |
| GET | `/api/users/me` | All | Get own profile |
| PUT | `/api/users/me` | All | Update own profile |
| GET | `/api/users/:id` | Admin, Manager | Get user by ID |
| PUT | `/api/users/:id` | Admin, Manager | Update user |
| DELETE | `/api/users/:id` | Admin | Deactivate user |

---

## 🗄️ Database Schema

```javascript
User {
  name:       String (required)
  email:      String (required, unique)
  password:   String (hashed, never returned)
  role:       Enum ['admin', 'manager', 'user']
  status:     Enum ['active', 'inactive']
  createdBy:  ObjectId (ref: User)
  updatedBy:  ObjectId (ref: User)
  createdAt:  Date (auto)
  updatedAt:  Date (auto)
}
```

---

## 🔒 Security Practices

- Passwords hashed with bcrypt (12 salt rounds)
- JWT secrets stored in environment variables
- Password field excluded from all queries (`select: false`)
- Input validation on all routes via express-validator
- CORS restricted to frontend origin
- Inactive users blocked at login and middleware level
- HTTP status codes: `401` (unauthenticated), `403` (unauthorized)

---

## 🚢 Deployment

### Backend → Render
1. Push code to GitHub
2. New Web Service on Render → connect repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env`

### Frontend → Vercel
1. New Project on Vercel → connect repo
2. Root directory: `frontend`
3. Framework: Vite
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

---


