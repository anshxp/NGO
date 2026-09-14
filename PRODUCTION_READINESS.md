# NGO Production Readiness

Branch: `production-hardening`

## Current status

The repository has completed the code-hardening phases performed on this branch. The application is a React/Vite frontend using REST/JSON against an Express/JavaScript backend with Mongoose/MongoDB. GraphQL and the old TypeScript runtime are not part of the current architecture.

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

## CI validation

The latest successful Production Quality workflow completed all three jobs:

- repository-hygiene: success
- backend: success
- frontend: success

The latest successful run was executed against commit `c4d4d0185a1d2f1dee4f902a9575291edab23fbf`. The campaign API cleanup was subsequently committed as `e4c68f8ad69acfb3cea39cf8b3ee7f0f36344c4d` and requires the normal CI run for that new commit.

## Explicitly pending

Payment integration is intentionally **not** marked complete. Razorpay order/signature code exists, but live payment readiness requires real sandbox/live gateway testing and additional gateway-side verification such as confirming the payment/order state and amount before marking a donation successful.

Deployment is also intentionally **not** marked complete. Deployment is managed by the project owner and must be validated in the actual hosting environment with the production MongoDB, frontend URL, CORS, cookies, SMTP, and gateway configuration.

## Database

MongoDB connection configuration is retained as provided by the project. The backend uses Mongoose and the configured `MONGO_URI`/`DB_NAME` values.

## Final classification

**Code hardening:** completed for the implemented phases.

**CI baseline:** passing before the latest frontend API cleanup; rerun CI on the latest commit before declaring the branch fully green.

**Payment:** pending.

**Deployment/live end-to-end verification:** pending owner-side deployment.

**AcroIn-specific departmental-admin rules:** not applicable to this NGO repository and are not implemented here.
