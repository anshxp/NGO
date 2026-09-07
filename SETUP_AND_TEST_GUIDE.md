# Frontend-Backend Connection Setup & Test Guide

## Current architecture

The application uses a straightforward MERN + REST architecture:

```text
React frontend
     |
     | REST / JSON + HttpOnly JWT cookie
     v
Express backend
     |
     | Mongoose
     v
MongoDB
```

## Local startup

### Backend

```bash
cd backend
npm install
npm run typecheck
npm run build
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` to the backend base URL when frontend and backend are deployed separately. The default API base is `/api`.

## Connection smoke test

### 1. Health check

Open the backend health endpoint:

```text
GET /health
```

Expected response:

```json
{"status":"ok","service":"ngo-api"}
```

### 2. Readiness check

```text
GET /ready
```

A `200` response indicates that Mongoose is connected. A `503` response indicates that the backend is running but the database is not ready.

### 3. Contact/enquiry flow

Submit the contact form from the frontend. It sends:

```text
POST /api/enquiries
```

Verify that the response succeeds and the corresponding enquiry document exists in MongoDB.

### 4. Authentication flow

Test:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

The browser should retain the HttpOnly `ngo_access_token` cookie. No JWT should be stored in localStorage.

### 5. Administrative volunteer flow

After logging in as an administrator, test:

```text
GET  /api/admin/volunteers
POST /api/admin/volunteers
PATCH /api/admin/volunteers/:id/status
```

The volunteer page uses `volunteerAPI` from `frontend/src/lib/apiClient.ts`.

## Database test

After a successful write, verify the document in the configured MongoDB database. Do not use destructive commands against production data.

## Payment test

Use sandbox/test credentials. Payment completion must be confirmed by the backend gateway verification endpoint; a frontend success state is not sufficient.

## Email test

SMTP-dependent features require configured SMTP credentials. A missing SMTP configuration should not be mistaken for a frontend/backend connectivity failure.

## Build validation

Backend:

```bash
npm run typecheck
npm run build
```

Frontend:

```bash
npm run lint
npm run build
```

## Troubleshooting

Frontend receives CORS errors: verify `FRONTEND_URL`, the deployed frontend origin, HTTPS and credentialed requests.

Frontend receives 404 for an API call: verify `VITE_API_URL` and confirm the corresponding route exists under `/api`.

Authentication returns 401: verify the cookie is being sent, backend CORS has `credentials: true`, and frontend/backend origins match the deployment configuration.

Readiness returns 503: inspect `MONGODB_URI`, MongoDB network access rules and database credentials.

## Phase 1 result

The legacy GraphQL connection path has been removed. The current connection flow is REST/JSON only.
