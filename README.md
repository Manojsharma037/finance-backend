# Finance Data Processing and Access Control Backend

A backend system for a finance dashboard that supports financial record management, role-based access control, and summary analytics.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

---

## Project Structure
```
finance-backend/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── roleGuard.js       # Role based access control
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   └── user.routes.js
│   │   ├── records/
│   │   │   ├── record.model.js
│   │   │   ├── record.controller.js
│   │   │   └── record.routes.js
│   │   └── dashboard/
│   │       ├── dashboard.controller.js
│   │       └── dashboard.routes.js
│   └── app.js
├── .env.example
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/finance-backend.git
cd finance-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables setup
Create a `.env` file in root directory:
```
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

Server will start at `http://localhost:3000`

---

## API Endpoints

### Auth / Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register new user |
| POST | `/api/users/login` | Public | Login and get JWT token |
| GET | `/api/users` | Admin | Get all users |
| PATCH | `/api/users/:id` | Admin | Update user role or status |

### Financial Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/records` | Admin, Analyst | Create a new record |
| GET | `/api/records` | All roles | Get records (with filters) |
| PUT | `/api/records/:id` | Admin, Analyst | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

#### Filters available on GET /api/records:
```
?type=income
?type=expense
?category=salary
?from=2026-01-01&to=2026-04-30
```

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Admin, Analyst | Get financial summary |

#### Dashboard Response includes:
- Total income
- Total expenses  
- Net balance
- Category wise totals
- Monthly trends
- Recent 5 activities

---

## Role Based Access Control

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View own records | ✅ | ✅ | ✅ |
| View all records | ❌ | ✅ | ✅ |
| Create records | ❌ | ✅ | ✅ |
| Update records | ❌ | ✅ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Dashboard summary | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Get the token by calling `/api/users/login`.

---

## Error Handling

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid token |
| 403 | Forbidden / insufficient role |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Assumptions Made

- A user can self-register with any role during development. In production, role assignment should be restricted to admins only.
- Soft delete is used for records — deleted records are hidden from all responses but remain in the database.
- Viewers can only see their own records. Analysts and Admins can see all records.
- MongoDB Atlas free tier (M0) is used for data persistence.
- JWT tokens are valid for 7 days.

---

## Sample Request Flow

### 1. Register as Admin
```json
POST /api/users/register
{
  "name": "Manoj Admin",
  "email": "manoj@gmail.com",
  "password": "manoj123",
  "role": "admin"
}
```

### 2. Login and copy token
```json
POST /api/users/login
{
  "email": "manoj@gmail.com",
  "password": "manoj123"
}
```

### 3. Create a record
```json
POST /api/records
Authorization: Bearer <token>
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

### 4. View dashboard
```
GET /api/dashboard/summary
Authorization: Bearer <token>
```
```

---

## `.env.example` file bhi banao

Root mein `.env.example` naam se file banao:
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/financedb
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d