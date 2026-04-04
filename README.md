# Finance Data Processing and Access Control Backend

A backend system for a finance dashboard that supports financial record management, role-based access control, and summary analytics.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Deployment**: Render

---

## Live Demo

- **API Documentation (Swagger)**: https://finance-backend-manoj.onrender.com/api-docs
- **Base URL**: https://finance-backend-manoj.onrender.com

> **Note:** First request may take 30-50 seconds as Render free tier spins up from sleep. Subsequent requests will be fast.

---

## Project Structure

```
finance-backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── swagger.js         # Swagger configuration
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
git clone https://github.com/Manojsharma037/finance-backend.git
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
Swagger docs at `http://localhost:3000/api-docs`

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
| POST | `/api/records` | Admin | Create a new record |
| GET | `/api/records` | All roles | Get records with filters |
| PUT | `/api/records/:id` | Admin | Update a record |
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
| GET | `/api/dashboard/summary` | All roles | Get financial summary |

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
| Dashboard summary | ✅ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
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

## Design Decisions

- **MongoDB over SQL**: Financial records are document-natured, no complex joins needed
- **JWT over Sessions**: Stateless, scales easily across multiple servers
- **Soft Delete**: Financial data should never be permanently lost — audit trail maintained
- **Modular Structure**: Each feature independent, easy to maintain and scale
- **Swagger Documentation**: API docs live alongside code — always in sync
- **MongoDB Atlas**: Cloud hosted database — zero infrastructure setup

---

## Assumptions Made

1. Self-registration allowed with any role during development. In production, role assignment should be restricted to admins only.

2. Soft delete used for records — financial data should never be permanently deleted for audit trail purposes.

3. Viewer can only see their own records. Analysts and Admins can see all records.

4. Dashboard shows company-wide financial summary — all roles can access it as it provides read-only overview.

5. MongoDB Atlas M0 free tier used for data persistence. Production would use a paid tier.

6. JWT tokens are valid for 7 days. Production would use shorter expiry with refresh tokens.

7. Records are always created under the logged-in user's ID. Admin creating a record for another user is a future enhancement.

8. Viewer's GET /api/records returns empty array in this demo as no records exist under viewer's ID — this is expected behaviour. In production, admin would create records for viewers.

9. Analyst role is read-only as per assignment — can view records and access summaries but cannot create or modify records.

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