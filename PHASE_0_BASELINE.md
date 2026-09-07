# Phase 0 — Production Baseline

**Branch:** `production-hardening`  
**Repository:** `anshxp/NGO`  
**Purpose:** Establish a non-destructive baseline before the MERN-only production hardening migration.

## 1. Baseline decision

The current `production-hardening` branch is the source of truth for the migration. Phase 0 does **not** remove functionality, change database schemas, or modify authentication/payment behavior.

The migration target is:

```text
React + JSX
    ↓
REST / JSON
    ↓
Express + JavaScript
    ↓
Mongoose
    ↓
MongoDB
```

GraphQL and TypeScript are explicitly out of scope for the final architecture.

## 2. Current release blockers

The repository is not yet production-ready for the requested target architecture because the branch still contains TypeScript tooling/source and GraphQL artifacts. Existing CI has also reported failing backend and frontend production-quality jobs.

These are tracked as migration work rather than silently ignored.

## 3. Functionality that must be preserved

The following existing product areas are protected during migration:

- Authentication and session lifecycle
- Role-based authorization
- Membership management
- Donations and payment processing
- Payment webhook/signature verification
- Campaigns
- Projects and expenses
- Events and registrations
- Internship management
- Certificates and QR verification
- Tax receipts / receipt management
- Beneficiaries
- Enquiries
- News/activity feed
- Member messaging
- Reports
- Email notifications
- PDF generation
- Scheduled/cron jobs
- MongoDB/Mongoose persistence
- React frontend routing and user/admin workflows

## 4. Hard production gates

A phase is not considered complete if it causes any of the following:

- frontend build failure
- backend startup failure
- MongoDB connection failure
- authentication regression
- authorization regression
- payment verification regression
- broken frontend-to-backend API calls
- exposed secrets
- unsafe production CORS
- unhandled server errors
- failing required CI checks

## 5. Phase 0 test baseline

The existing GitHub Actions production-quality workflow currently reports failures for both the backend and frontend jobs on the branch. These failures are treated as pre-migration baseline failures and must be resolved before final release acceptance.

The baseline therefore has two separate concepts:

1. **Existing failures:** failures already present before the migration.
2. **Regression failures:** failures introduced by a migration phase.

Every subsequent phase must avoid adding regression failures.

## 6. Required architecture constraints

The production implementation will remain deliberately simple:

- MongoDB
- Mongoose
- Express
- Node.js
- React
- REST/JSON
- Existing necessary third-party integrations only

The migration will not introduce GraphQL, Apollo, microservices, Prisma, or another database layer merely for architectural complexity.

## 7. Security baseline

Production hardening will cover:

- authentication/session security
- RBAC and authorization enforcement
- secure cookies/tokens as applicable
- CSRF/origin protection for cookie-authenticated mutations
- rate limiting
- request-size limits
- input validation
- MongoDB operator-injection protection
- secure CORS
- security headers
- payment signature/webhook validation
- idempotent payment processing
- secret/environment separation
- safe error responses
- dependency review
- graceful shutdown and failure handling

## 8. Phase 0 exit status

**STATUS: COMPLETE — BASELINE RECORDED**

No destructive migration has been performed in Phase 0.

Next phase: **Phase 1 — Remove GraphQL completely while preserving the existing REST/application behavior.**
