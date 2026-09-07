# NGO Management System - Project Summary

## Overview

The NGO Management System is a MERN application for memberships, donations, certificates, campaigns, projects, events, internships, enquiries, messaging, beneficiaries, receipts, reporting and administration.

**Architecture**: React + Vite frontend, Node.js + Express backend, MongoDB + Mongoose, REST/JSON APIs.

## Backend

The backend is implemented in TypeScript and organized around:

- MongoDB/Mongoose schemas in `backend/src/schema`
- Express middleware in `backend/src/middleware`
- REST routes in `backend/src/routes`
- Utility services in `backend/src/utils`
- JWT authentication with HttpOnly cookies
- Role-based authorization for administrative operations

### REST route groups

- `/api/auth/*` — registration, login, logout and current-user lookup
- `/api/news/*` — public news
- `/api/activities/*` — activity feed
- `/api/campaigns/*` — campaigns
- `/api/projects/*` — projects
- `/api/events/*` — events
- `/api/internships/*` — internships
- `/api/certificates/*` — certificate verification
- `/api/donations/*` — donations and payment flows
- `/api/enquiries/*` — visitor enquiries
- `/api/admin/*` — authenticated administrative operations
- `/api/admin/reports/*` — report generation

## Frontend

The frontend uses React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui/Radix components, React Hook Form, Axios, Recharts and React Router.

`frontend/src/lib/apiClient.ts` is the single REST client and exposes service modules for authentication, memberships, donations, certificates, news, activities, campaigns, projects, beneficiaries, events, internships, enquiries, messages, receipts, volunteers and reports.

`frontend/src/contexts/AuthContext.tsx` initializes authentication with `/api/auth/me` and does not store JWT access tokens in localStorage.

## Feature coverage

The application includes membership administration, online donations, payment verification, certificate issuance and verification, campaigns, projects and expenses, events and registrations, internships, news, activity feeds, volunteer management, enquiries, messaging, beneficiary tracking, receipts and PDF reports.

## Security

The production baseline includes Helmet, restricted CORS, body-size limits, request rate limiting, authentication/authorization middleware, cookie-authentication origin protection, audit middleware and environment validation.

Payment verification is performed server-side. Secrets belong in environment variables and must not be exposed to the frontend or committed to the repository.

## Development

```bash
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

## Validation

```bash
# backend
cd backend
npm run typecheck
npm run build

# frontend
cd frontend
npm run lint
npm run build
```

GitHub Actions runs these checks plus high-severity dependency audits.

## Phase 1 status

GraphQL has been removed from the current production architecture. The GraphQL source tree, frontend GraphQL client, GraphQL runtime dependency set and obsolete GraphQL endpoint are not part of the current branch. Active documentation is REST-based.

## Deployment

See `DEPLOYMENT.md` and `GETTING_STARTED.md` for environment, MongoDB, email, payment and deployment configuration.

## Important limitation

Repository validation confirms code structure and build configuration. End-to-end behavior for MongoDB, SMTP, payment gateways, production cookies/CORS and deployed frontend/backend connectivity requires real environment configuration and runtime execution.
