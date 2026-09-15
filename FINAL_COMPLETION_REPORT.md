# NGO Website - Current Completion Report

## Current status

The `production-hardening` branch has been standardized on a MERN + REST/JSON architecture.

This document reflects the current implementation rather than the original feature-completion snapshot.

## Application stack

- React 18 + Vite + TypeScript
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- REST/JSON API under `/api`
- JWT authentication through HttpOnly cookies
- Tailwind CSS + shadcn/ui/Radix components
- Axios frontend API client

## Phase 1 completed work

- Removed the legacy GraphQL backend source tree.
- Removed the legacy GraphQL frontend client.
- Removed the obsolete legacy backend GraphQL entrypoint.
- Removed stale backend GraphQL dependency lock metadata.
- Migrated identified frontend API consumers to the REST client.
- Removed stale GraphQL API documentation from active operational guides.
- Updated project, testing, volunteer, security and setup documentation to REST terminology.
- Removed mock membership data from the user dashboard and stopped it from calling an admin-only membership endpoint.

## Active API flow

```text
React page
   |
   | Axios / REST JSON
   v
Express `/api`
   |
   | Mongoose
   v
MongoDB
```

Authentication requests use an HttpOnly JWT cookie and `withCredentials` requests. The frontend does not need to read or store the JWT.

## Core areas

Memberships, donations, payment verification, certificates, campaigns, projects, events, internships, news, activities, enquiries, messaging, volunteers, beneficiaries, receipts and reports are represented in the current REST service layer.

## Validation

The repository's production-quality workflow runs backend typecheck/build, frontend lint/build and high-severity dependency audits.

The dependency audit is a separate hardening gate and should not be represented as passing until the current dependency tree has been remediated.

## Deployment readiness

Live end-to-end verification still depends on configured MongoDB, SMTP, payment gateway credentials, deployment URLs, HTTPS and CORS/cookie configuration.

Phase 1 is complete at the repository architecture/documentation level. The next phase is the planned TypeScript/TSX-to-JavaScript/JSX migration and subsequent runtime/security hardening.
