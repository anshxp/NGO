# NGO Management System - Getting Started

## Prerequisites

- Node.js 20.20+
- npm
- MongoDB locally or MongoDB Atlas
- SMTP credentials for email features
- Payment gateway credentials for live payment testing

## Environment

Copy the backend environment template:

```bash
cd backend
cp .env.example .env
```

Set the MongoDB connection, JWT secret, frontend URL, email settings, organization settings, and payment gateway credentials required by the features you intend to use.

For the frontend, set `VITE_API_URL` only when the frontend and backend are deployed separately. The default is `/api`.

## Run locally

### Backend

```bash
cd backend
npm install
npm run typecheck
npm run build
npm run dev
```

The Express server exposes health/readiness routes and REST APIs under `/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL shown by the terminal.

## REST smoke checks

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Public resources include:

```text
GET /api/news
GET /api/activities
GET /api/campaigns
GET /api/campaigns/active
GET /api/projects
GET /api/events
GET /api/events/upcoming
GET /api/internships
GET /api/certificates/verify/:code
POST /api/enquiries
```

Authenticated and administrative APIs cover memberships, donations, certificates, volunteers, beneficiaries, projects, events, internships, messages, receipts and reports.

The browser authenticates through the backend's HttpOnly JWT cookie. Do not place authentication tokens in localStorage.

## Database verification

The backend connects through Mongoose. After configuring `MONGODB_URI`, verify that the backend starts successfully and that a registration/enquiry/donation test creates the expected MongoDB document.

Do not run destructive database commands against production data while performing local smoke tests.

## Email verification

SMTP-dependent operations should be tested only after configuring valid credentials. Application email failures should not be treated as payment verification success/failure signals unless the specific endpoint documents that dependency.

## Payment verification

Use gateway test/sandbox credentials before production credentials. Razorpay payment verification is performed server-side using the configured secret. Never expose gateway secrets to the frontend.

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

GitHub Actions repeats these checks through `.github/workflows/production-quality.yml` and also runs high-severity npm audit gates.

## Troubleshooting

If the frontend cannot reach the backend, first verify `VITE_API_URL`, the backend `/api/health` route, CORS configuration, and browser Network requests.

If authentication repeatedly returns 401, verify that the browser accepts cookies for the deployed frontend/backend domain arrangement and that `FRONTEND_URL`, CORS, HTTPS and cookie settings are consistent.

If MongoDB fails to connect, verify `MONGODB_URI`, network access rules, database credentials and DNS/TLS configuration.

If a payment flow fails, inspect the backend logs for the payment order/verification request without logging secrets.

## Architecture

```text
React + Vite
     |
     | REST / JSON + HttpOnly cookie
     v
Express + TypeScript
     |
     | Mongoose
     v
MongoDB
```

GraphQL is not part of the current application architecture.