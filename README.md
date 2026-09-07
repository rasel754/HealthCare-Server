# HealthCare Server API Documentation

Welcome to the backend documentation for the **HealthCare System Server**. This documentation is tailored specifically for frontend developers integrating with this Express.js & Prisma ORM backend.

---

## 📌 Project Overview

- **Base URL (Local)**: `http://localhost:5000` (or configured `PORT`)
- **API Base Path**: `/api/v1`
- **Better-Auth Base Path**: `/api/auth`
- **Stripe Webhook Path**: `/webhook`
- **Architecture**: Node.js + Express.js 5 + TypeScript + Prisma 7 ORM + PostgreSQL
- **Caching & In-Memory Store**: Redis (via `redis` client)
- **Authentication**: Better Auth + Custom JWT Tokens (Dual-token & session authentication)
- **File Storage**: Cloudinary (handled via Multer)
- **Payments**: Stripe Payment Gateway

---

## 🔑 Authentication & Authorization Flow

The application uses a **dual-layer authentication model**:

1. **Better-Auth Session Token**: Identifies the logged-in session. Transmitted via cookie (`better-auth-session`, `better-auth.session_token`, or `better-auth-session-token`) or `Authorization: Bearer <sessionToken>` header.
2. **JWT Access & Refresh Tokens**: Transmitted via cookies (`accessToken`, `refreshToken`) or `Authorization: Bearer <accessToken>` header.

### User Roles (`Role` Enum)
- `SUPER_ADMIN`
- `ADMIN`
- `DOCTOR`
- `PATIENT`

### Handling Requests on Frontend
When sending requests to protected endpoints, ensure your HTTP client (e.g. `axios`, `fetch`) sends `credentials: 'include'` (with credentials enabled) or includes the token headers:

```http
Authorization: Bearer <accessToken_or_sessionToken>
Content-Type: application/json
```

---

## 📤 Response & Error Formats

### Standard Success Response
All `/api/v1` endpoints return JSON in the following standard structure:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Standard Error Response
In case of validation (Zod), Prisma, or authentication errors, the server returns:

```json
{
  "success": false,
  "message": "Error description message",
  "errorSources": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "error": {}, // Only present in development mode
  "stack": ""  // Only present in development mode
}
```

---

## 🛠 Setup & Environment Configuration

### Frontend Environment Variables
When connecting to this backend, your frontend project should configure the following environment endpoints:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000/api/auth
```

### Server `.env` Reference
| Variable Key | Description |
|---|---|
| `PORT` | Port server runs on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS & redirects (e.g., `http://localhost:3000`) |
| `BETTER_AUTH_URL` | Better-Auth URL (e.g., `http://localhost:5000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection URL (e.g., `redis://localhost:6379` or cloud instance) |
| `ACCESS_TOKEN_SECRET` | Secret key for signing access JWTs |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh JWTs |

---

## 🚀 API Endpoint Reference

### 🔐 1. Authentication & Account (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a new patient account (`name`, `email`, `password`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user credentials (`email`, `password`) |
| `GET` | `/api/v1/auth/me` | Logged In | Fetch current authenticated user profile details |
| `POST` | `/api/v1/auth/refresh-token` | Public (Cookie/Header) | Issue a new access token using `refreshToken` |
| `POST` | `/api/v1/auth/change-password` | Logged In | Change user password (`oldPassword`, `newPassword`) |
| `POST` | `/api/v1/auth/logout` | Logged In | Clear auth cookies & terminate session |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify email address using OTP (`email`, `otp`) |
| `POST` | `/api/v1/auth/forget-password` | Public | Send password reset OTP email (`email`) |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password using OTP (`email`, `otp`, `newPassword`) |
| `GET` | `/api/v1/auth/login/google` | Public | Initiate Google OAuth 2.0 Login |

---

### 👤 2. User Management (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/users/create-doctor` | Admin / Super Admin | Create a new Doctor account with specialty mapping |
| `POST` | `/api/v1/users/create-admin` | Super Admin | Create a new Admin account |
| `POST` | `/api/v1/users/create-super-admin` | Super Admin | Create a new Super Admin account |

---

### 🩺 3. Doctor Management (`/api/v1/doctors`)

| Method | Endpoint | Access | Query / Payload Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors` | Admin, Super Admin, Doctor | Supports filtering & pagination |
| `GET` | `/api/v1/doctors/:id` | Admin, Super Admin, Doctor | Get detailed doctor profile |
| `PATCH` | `/api/v1/doctors/:id` | Admin, Super Admin, Doctor | Update doctor profile details |
| `DELETE` | `/api/v1/doctors/:id` | Admin, Super Admin | Soft delete doctor record |

---

### 🏥 4. Patient Profile (`/api/v1/patient`)

| Method | Endpoint | Access | Form Data / Content-Type |
|---|---|---|---|
| `PATCH` | `/api/v1/patient/update-my-profile` | Patient | `multipart/form-data`<br>- `profilePhoto`: Single file (image)<br>- `medicalReports`: Up to 5 files (PDF/images)<br>- `patientInfo`: JSON string / form fields |

---

### 🩺 5. Specialties (`/api/v1/specialty`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/specialty` | Public | Fetch list of all medical specialties |
| `POST` | `/api/v1/specialty` | Public / Admin | Create a new specialty (`multipart/form-data` with `icon`) |
| `PATCH` | `/api/v1/specialty/:id` | Admin, Super Admin | Update specialty details/icon |
| `DELETE` | `/api/v1/specialty/:id` | Admin, Super Admin | Delete specialty record |

---

### 📅 6. Master Schedules (`/api/v1/schedules`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/schedules` | Admin, Super Admin | Create global system schedule slots |
| `GET` | `/api/v1/schedules` | Admin, Super Admin, Doctor | List all global schedules |
| `GET` | `/api/v1/schedules/:id` | Admin, Super Admin, Doctor | Get single schedule details |
| `PATCH` | `/api/v1/schedules/:id` | Admin, Super Admin | Update schedule details |
| `DELETE` | `/api/v1/schedules/:id` | Admin, Super Admin | Delete schedule slot |

---

### 👨‍⚕️ 7. Doctor Schedules (`/api/v1/doctor-schedules`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/doctor-schedules/create-my-doctor-schedule` | Doctor | Claim / assign schedules to current doctor |
| `GET` | `/api/v1/doctor-schedules/my-doctor-schedules` | Doctor | List current doctor's claimed schedule slots |
| `GET` | `/api/v1/doctor-schedules` | Admin, Super Admin | List all assigned doctor schedules |
| `PATCH` | `/api/v1/doctor-schedules/update-my-doctor-schedule` | Doctor | Update current doctor schedule |
| `DELETE` | `/api/v1/doctor-schedules/delete-my-doctor-schedule/:id` | Doctor | Remove schedule slot from doctor |

---

### 📋 8. Appointments (`/api/v1/appointments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/appointments/book-appointment` | Patient | Book appointment and generate payment link |
| `POST` | `/api/v1/appointments/book-appointment-with-pay-later` | Patient | Book appointment with unpaid status |
| `POST` | `/api/v1/appointments/initiate-payment/:id` | Patient | Initiate payment for an existing unpaid appointment |
| `GET` | `/api/v1/appointments/my-appointments` | Patient, Doctor | Fetch appointments for logged in user |
| `GET` | `/api/v1/appointments/my-single-appointment/:id` | Patient, Doctor | Get details for single appointment |
| `GET` | `/api/v1/appointments/all-appointments` | Admin, Super Admin | Fetch all system appointments |
| `PATCH` | `/api/v1/appointments/change-appointment-status/:id` | Admin, Doctor, Patient | Change appointment status (`SCHEDULED`, `INPROGRESS`, `COMPLETED`, `CANCELED`) |

---

### 💊 9. Prescriptions (`/api/v1/prescription`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/prescription/my-prescriptions` | Patient, Doctor | Get prescriptions belonging to logged in user |
| `POST` | `/api/v1/prescription` | Doctor | Create a prescription for an appointment |
| `PATCH` | `/api/v1/prescription/:id` | Doctor | Update prescription details |
| `DELETE` | `/api/v1/prescription/:id` | Doctor | Delete prescription |
| `GET` | `/api/v1/prescription` | Admin, Super Admin | Get all prescriptions |

---

### ⭐ 10. Reviews & Ratings (`/api/v1/review`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/review` | Public | List all public reviews |
| `GET` | `/api/v1/review/my-reviews` | Patient, Doctor | List reviews given or received |
| `POST` | `/api/v1/review` | Patient | Post review for completed appointment |
| `PATCH` | `/api/v1/review/:id` | Patient | Update review rating/comment |
| `DELETE` | `/api/v1/review/:id` | Patient | Delete review |

---

### 📊 11. Dashboard Analytics & Stats (`/api/v1/stats`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/stats` | Super Admin, Admin, Doctor, Patient | Returns role-specific dashboard metrics & totals |

---

### 🛠 12. Admin & Super Admin Controls (`/api/v1/admins`, `/api/v1/super-admins`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `PATCH` | `/api/v1/admins/change-user-status` | Admin, Super Admin | Change user status (`ACTIVE`, `BLOCKED`, `DELETED`) |
| `PATCH` | `/api/v1/admins/change-user-role` | Super Admin | Change user role |
| `GET` | `/api/v1/admins` | Admin, Super Admin | List all admins |
| `GET` | `/api/v1/super-admins` | Super Admin | List all super admins |

---

### 🤖 13. AI & RAG Search (`/api/v1/rag`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/rag/stats` | Public | Get vector store document counts & RAG stats |
| `POST` | `/api/v1/rag/ingest-doctor` | Admin, Super Admin | Ingest and embed doctor profiles into vector store |
| `POST` | `/api/v1/rag/query` | Public | Query AI Doctor search with automatic **Redis caching** |

---

## ⚡ Redis In-Memory Caching & Performance

The backend incorporates **Redis** as a high-performance in-memory caching layer (`src/app/lib/redis.ts`) to reduce latency, prevent duplicate expensive computations, and enhance scalability.

### 🏗 Architecture & Service Layer
- **Singleton Client**: Manages a unified Redis client instance initialized during server startup (`src/server.ts`).
- **Connection Flexibility**: Supports `REDIS_URL` connection strings with automatic fallback to individual socket options (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).
- **Resilience & Graceful Degradation**: If Redis is offline or disconnected, cache operations fail gracefully with warnings rather than crashing API requests or throwing 500 errors.

### 🛠 Core Methods
| Method | Description |
|---|---|
| `get(key)` | Retrieves a cached value string or `null` if expired/missing. |
| `set(key, value, ttlInSeconds)` | Serializes objects to JSON and sets a key with a Time-To-Live (TTL). |
| `update(key, value, ttlInSeconds)` | Updates existing key value and resets TTL. |
| `delete(key)` | Removes a key from the cache. |
| `isAvailable()` | Pings Redis to check health and connectivity status. |

### 🚀 Caching Strategy & Implementation
- **AI / RAG Doctor Search (`/api/v1/rag/query`)**:
  - **Dynamic Cache Key**: `rag:query:<query>:<limit>:<sourceType>`
  - **TTL (Time-To-Live)**: `1800` seconds (30 minutes).
  - **Cache Flow**:
    1. **Cache Hit**: Returns cached answers immediately (sub-millisecond latency).
    2. **Cache Miss**: Generates answers via AI embedding + vector search + LLM, caches the result in Redis with 30-minute expiration, and returns the response to the client.

---

## ⚡ Background Tasks & Webhooks

1. **Unpaid Appointment Cancellation**: A server cron job runs every 25 minutes to automatically cancel appointments that remain unpaid.
2. **Stripe Webhooks**: Listens on `/webhook` for `checkout.session.completed` events to update payment and appointment status dynamically.

---

## 💡 Best Practices for Frontend Integration

1. **Credentials Support**: Always configure Axios or Fetch with `withCredentials: true` / `credentials: 'include'` so HTTP-only auth cookies are stored and sent automatically.
2. **Handling Token Expiry**: Listen for `X-Session-Refresh` header from response headers or handle `401 Unauthorized` by calling `/api/v1/auth/refresh-token`.
3. **Form Uploads**: For patient profile updates and specialty creations, use `FormData` objects and DO NOT manually set `Content-Type: application/json`.
