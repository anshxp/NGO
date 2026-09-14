# NGO Production Readiness

Branch: `production-hardening`

## Current status

The repository has completed the code-hardening work that is in scope for this branch. The application is a React/Vite frontend using REST/JSON against an Express/JavaScript backend with Mongoose/MongoDB. GraphQL and the old TypeScript runtime are not part of the current architecture.

This document deliberately separates repository hardening from deployment and payment operations. A passing CI run is not evidence that a deployed environment, MongoDB credentials, SMTP, or live payment processing has been validated.

## Completed phases

### Phase 1 — Architecture cleanup

- Removed the old GraphQL runtime from the active application architecture.
- Standardized the application on REST/JSON endpoints.

### Phase 2 — JavaScript migration

- Completed the frontend/backend JavaScript migration.
- Removed obsolete TypeScript/TSX runtime files and configuration.
- CI validation for backend, frontend, and repository hygiene passed.

### Phase 3 — Security and runtime hardening

- Explicit reverse-proxy trust configuration.
- HttpOnly JWT authentication cookies.
- Production cookie security and configurable SameSite policy.
- JWT issuer/audience validation and token-version invalidation on logout.
- CSRF origin protection for state-changing cookie-authenticated requests.
- Helmet security headers.
- Exact CORS allowlist with credentials.
- Authentication and general API rate limiting.
- Request body limits and request/response timeouts.
- Disabled Express `x-powered-by`.
- Health and readiness endpoints.
- ObjectId validation on protected resource identifiers.
- Sensitive fields excluded from API responses.
- Timing-safe Razorpay signature comparison.
- Removed the legacy JWT middleware/token utility that contained a fallback secret.
- Removed the tracked frontend `.env` file containing local/test configuration.

### Phase 4 — API/data-integrity hardening

- Added frontend-backed activity like/comment endpoints.
- Added project report endpoint.
- Added authenticated membership renewal endpoint.
- Added unique event registration constraint and duplicate-key handling.
- Aligned event status validation with the admin event creation flow.
- Added donation indexes and excluded payment signatures from normal queries.
- Normalized the frontend API base URL so both a backend origin and `/api` base URL work.
- Removed the unsupported frontend campaign donation API method because the REST backend does not expose a corresponding campaign donation endpoint.
- Production frontend/backend cookie configuration is documented.

## Current validation

The repository's Production Quality workflow validates repository hygiene, backend syntax and dependency audit, frontend lint/build, and frontend dependency audit. CI uses `npm install --ignore-scripts`; the repository currently does not commit npm lockfiles.

A CI pass validates the repository in the runner. It does not replace deployment smoke tests or external security testing.

## Known limitations / explicit pending items

### Payment

Payment integration is intentionally **pending**. Razorpay order creation and signature verification code exists, but live payment readiness requires sandbox testing and gateway-side verification of payment/order state, amount, currency, and idempotency. A webhook/reconciliation design has not been declared complete.

### Deployment

Deployment is intentionally **pending owner-side execution**. The actual hosting environment must be tested with the production MongoDB, frontend URL, CORS, cookies, SMTP, and gateway configuration.

### Automated application tests

The repository does not currently contain a dedicated automated application test suite. CI therefore provides syntax, lint, build, hygiene, and dependency checks rather than full endpoint/integration/authorization coverage.

### Production operational controls

Backup restoration, penetration testing, live HTTPS/cookie behavior, SMTP delivery, payment sandbox/live behavior, and deployed frontend-to-backend end-to-end flows require access to the actual environment and are not claimed as completed here.

### Frontend route inventory

The active router intentionally exposes the pages currently wired in `frontend/src/App.jsx`. Some legacy page files remain in the repository but are not automatically treated as working production routes merely because the files exist. They should only be routed after their API contracts and UI integration are verified.

## Database

MongoDB connection configuration is retained as provided by the project. The backend uses Mongoose and the configured `MONGO_URI`/`DB_NAME` values.

## Final classification

**Repository code hardening:** completed for the implemented phases.

**CI baseline:** must remain green on the latest branch head after each change.

**Payment:** pending.

**Deployment/live end-to-end verification:** pending owner-side deployment.

**AcroIn-specific departmental-admin rules:** not applicable to this NGO repository and are not implemented here.
