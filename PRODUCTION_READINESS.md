# NGO Production Readiness

Branch: `production-hardening`

## Current status

The repository has completed the code-hardening work that is in scope for this branch. The application is a React/Vite frontend using REST/JSON against an Express/JavaScript backend with Mongoose/MongoDB. GraphQL and the old TypeScript runtime are not part of the current architecture.

This document deliberately separates repository hardening from deployment operations. A passing CI run is not evidence that a deployed environment, production MongoDB credentials, SMTP delivery, or live gateway processing has been validated.

## Completed code-hardening work

- REST/JSON architecture with obsolete GraphQL runtime removed.
- Frontend/backend JavaScript migration completed.
- HttpOnly JWT authentication with short-lived tokens, issuer/audience validation and token-version invalidation.
- Production cookie, CORS and CSRF controls.
- Helmet, rate limiting, request limits, request/response timeouts and disabled `x-powered-by`.
- Health/readiness endpoints and MongoDB startup dependency.
- ObjectId validation and sensitive-field exclusion.
- Legacy JWT middleware/token utility with insecure fallback secret removed.
- Tracked frontend `.env` removed; CI now rejects tracked environment files other than `.env.example`.
- Activity, project-report, membership-renewal and event-registration API coverage hardened.
- Event registration uniqueness/race handling and donation indexes hardened.
- Frontend API base URL normalized for same-origin and separate API deployments.
- Public campaign, activity and membership routes wired into the application router.
- Membership registration now uses the real authentication API instead of a nonexistent endpoint.
- Activity feed now uses the configured API client instead of a hard-coded same-origin request.
- Homepage hero image is bundled through Vite instead of referencing `/src/...` at runtime.
- Razorpay checkout now receives the server-created order and public key.
- Razorpay payment verification now validates the gateway order/payment, amount, currency and captured status server-side.
- Razorpay webhook endpoint added with raw-body HMAC verification and idempotent donation finalization.
- Backend security unit tests added and enforced in CI.
- Deployment/environment documentation aligned with the actual `MONGO_URI` runtime configuration.

## CI validation

The Production Quality workflow checks repository hygiene, absence of application TypeScript, backend syntax, backend tests, dependency vulnerabilities, frontend linting, frontend production build and frontend dependency vulnerabilities.

The latest run must be green on the current branch head before deployment.

## Operational items that cannot be proven from GitHub

### Deployment

The project owner must deploy the frontend and API and verify `/health`, `/ready`, browser authentication cookies, CORS, MongoDB connectivity, SMTP delivery and all required application workflows in the actual hosting environment.

### Payment activation

The payment code is now implemented defensively, including server-side gateway verification and a signed Razorpay webhook. Production payment activation still requires Razorpay sandbox testing, webhook delivery testing, reconciliation checks and final live-credential verification. Do not enable live payments until those tests pass.

### Security assessment

A repository CI pass is not a penetration test. Production launch should still include an external or internal security review appropriate to the organization's risk profile, especially for admin authorization, beneficiary data, payment workflows and exposed infrastructure.

### Backups

MongoDB backups and restoration must be configured and tested in the actual database environment. A source-code review cannot prove a backup can be restored.

## Database

MongoDB connection configuration is retained as provided by the project. The backend uses Mongoose and the configured `MONGO_URI`/`DB_NAME` values.

## Final classification

**Repository code:** production-oriented and CI-validated, subject to the latest workflow completing successfully.

**Security hardening:** implemented at the application layer; operational security testing remains required.

**Payment:** implementation hardened; production activation/testing remains required.

**Deployment:** owner-managed and not claimed as completed until the deployed environment passes smoke tests.

**AcroIn-specific departmental-admin rules:** not applicable to this NGO repository and are not implemented here.
