# NGO Management System - Implementation Guide

## Project Overview

A MERN web application for NGO operations including memberships, donations, certificates, campaigns, projects, events, internships, beneficiaries, enquiries, messaging, receipts, and administration.

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **API**: REST/JSON under `/api`
- **Authentication**: JWT delivered through an HttpOnly cookie
- **Payment**: Razorpay, PhonePe, PayU integrations
- **Email**: Nodemailer
- **PDF**: PDFKit
- **QR Codes**: qrcode

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Charts**: Recharts

## Project Structure

```text
backend/
├── src/
│   ├── connection/db.ts          # MongoDB connection
│   ├── middleware/               # Auth, CSRF, API security and audit middleware
│   ├── routes/
│   │   ├── auth.ts               # Authentication endpoints
│   │   ├── api.ts                # Public and protected REST endpoints
│   │   ├── admin.ts              # Admin REST endpoints
│   │   └── reports.ts            # Report endpoints
│   ├── schema/                   # Mongoose models
│   └── utils/                    # Auth, email, PDF, QR and scheduled jobs
└── package.json

frontend/
├── src/
│   ├── pages/                   # Public, member and admin pages
│   ├── components/              # Shared UI components
│   ├── contexts/AuthContext.tsx # Cookie-based auth state
│   └── lib/apiClient.ts         # REST API service modules
└── package.json
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Production build:

```bash
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Set `VITE_API_URL` to the backend base URL when frontend and backend are deployed separately. When served together, `/api` is the default.

## REST API

All application APIs are exposed as REST/JSON endpoints below `/api`.

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Public resources include news, activities, campaigns, projects, events, internships, certificate verification, donations, and enquiries.

Authenticated/admin resources include memberships, certificates, volunteers, beneficiaries, messages, receipts, reports, and administrative content management.

The application does not expose a GraphQL endpoint and does not use a GraphQL client.

## Authentication and Security

Authentication uses JWTs stored in an HttpOnly cookie. The frontend does not persist the access token in localStorage.

Production security includes:
- Helmet security headers
- Restricted CORS
- Request body limits
- Rate limiting
- Authentication and role-based authorization middleware
- Origin protection for cookie-authenticated mutations
- Audit middleware for sensitive requests
- Production environment validation
- Generic error responses that avoid leaking sensitive details

Secrets must remain in environment variables and never be committed.

## Core Feature Modules

Membership management supports registration, status tracking, renewal and administrative suspension.

Donation management supports donation creation, Razorpay order creation, payment verification, status management and user donation history.

Certificate management supports member and visitor certificates plus public verification by verification code.

Campaigns, projects, events and internships expose public listing endpoints and protected administrative management operations.

Volunteer management exposes administrative listing, registration, status, hours, background verification, task assignment and deletion endpoints.

Enquiries support public submission and administrative viewing, status updates, replies and deletion.

Messaging supports administrative sending, scheduling and deletion.

Receipts and reports provide administrative records and PDF-oriented endpoints.

## Database

MongoDB is the system of record. Mongoose models are under `backend/src/schema` and use schema validation and indexes where appropriate.

## Testing and Validation

Backend commands:

```bash
npm run typecheck
npm run build
```

Frontend commands:

```bash
npm run lint
npm run build
```

The repository also contains the production-quality GitHub Actions workflow under `.github/workflows/production-quality.yml`.

## Deployment

Use `DEPLOYMENT.md` for environment configuration, MongoDB setup, deployment and operational requirements.
