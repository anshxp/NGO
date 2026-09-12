# NGO Management System - Getting Started

## Prerequisites

- Node.js 20.20.x
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

Configure the values required by the features you intend to use. At minimum, the backend requires a MongoDB connection string, a JWT secret of at least 32 characters, and, in production, `FRONTEND_URL`.

The backend also supports explicit `TRUST_PROXY` configuration. Set it only to match the actual reverse-proxy/deployment topology.

For the frontend, set `VITE_API_URL` only when the frontend and backend are deployed separately. The default is `/api`.

## Run locally

### Backend

```bash
cd backend
npm install
npm run check
npm start
```

For development, use:

```bash
npm run dev
```

The Express server exposes `/health`, `/ready`, and REST APIs under `/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL shown by the terminal. The Vite development server proxies `/api` requests to the local backend on port `7856`.

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

The backend connects through Mongoose. After configuring `MONGO_URI`, verify that the backend starts successfully and that a registration, enquiry, or test donation creates the expected MongoDB document.

Do not run destructive database commands against production data while performing local smoke tests.

## Email verification

SMTP-dependent operations should be tested only after configuring valid credentials. Email delivery failures are handled separately from payment verification.

## Payment verification

Use gateway test/sandbox credentials before production credentials. Razorpay payment verification is performed server-side using the configured secret. Never expose gateway secrets to the frontend.

## Build and CI validation

The backend is JavaScript/ES modules and does not have a TypeScript build or `typecheck` script:

```bash
cd backend
npm run check
npm audit --audit-level=high
```

The frontend is JavaScript/JSX:

```bash
cd frontend
npm run lint
npm run build
```

GitHub Actions repeats these checks and also verifies repository hygiene. The production-quality workflow runs on pushes and pull requests targeting `master` or `production-hardening`.

## Troubleshooting

If the frontend cannot reach the backend, verify `VITE_API_URL`, the backend `/api/health` route, CORS configuration, and browser Network requests.

If authentication repeatedly returns 401, verify that the browser accepts cookies for the deployed frontend/backend domain arrangement and that `FRONTEND_URL`, CORS, HTTPS and cookie settings are consistent.

If MongoDB fails to connect, verify `MONGO_URI`, network access rules, database credentials and DNS/TLS configuration.

If a payment flow fails, inspect backend logs for the payment order/verification request without logging secrets.

## Architecture

```text
React + Vite
     |
     | REST / JSON + HttpOnly cookie
     v
Express + JavaScript
     |
     | Mongoose
     v
MongoDB
```

GraphQL is not part of the current application architecture.
