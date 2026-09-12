# Deployment Guide

This guide reflects the current production-hardening branch. The application uses React/Vite, Node.js/Express, MongoDB/Mongoose, REST/JSON APIs, and HttpOnly JWT cookies.

## 1. Production architecture

```text
Browser
  |
  | HTTPS
  v
React + Vite static frontend
  |
  | HTTPS REST/JSON + credentials
  v
Node.js 20 + Express API
  |
  | Mongoose
  v
MongoDB Atlas
```

The frontend and backend may be deployed separately. If they share an origin/reverse proxy, the frontend can use the default `/api` base path. For separate deployments, configure `VITE_API_URL` to the public API origin.

## 2. Backend deployment

Use a Node.js hosting provider that supports Node.js 20.20.x or later within the project's declared major-version range.

From `backend/`:

```bash
npm ci
npm run check
npm start
```

The application listens on `PORT` (default `7856`). The production process is `node src/index.js`; there is no TypeScript compilation step.

Expose these endpoints to your load balancer/monitoring system:

```text
GET /health   -> process health
GET /ready    -> process + MongoDB readiness
```

The service should not be considered ready when `/ready` returns HTTP 503.

## 3. Required backend environment

Create these values in the deployment platform's secret/environment configuration. Do not commit a production `.env` file.

```env
NODE_ENV=production
PORT=7856
MONGO_URI=mongodb+srv://<app-user>:<password>@<cluster>/<database>
DB_NAME=ngo_management_db
JWT_SECRET=<at-least-32-random-characters>
JWT_ISSUER=ngo-api
JWT_AUDIENCE=ngo-web
FRONTEND_URL=https://www.example-ngo.org
TRUST_PROXY=1
```

`TRUST_PROXY` must match the actual proxy topology. Do not blindly use `1` when the deployment has a different number or arrangement of trusted proxies.

Payment and SMTP variables are required only for the corresponding features:

```env
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
PHONEPE_MERCHANT_ID=...
PHONEPE_SALT_KEY=...
PAYUMONEY_MERCHANT_KEY=...
PAYUMONEY_SALT=...
EMAIL_HOST=...
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM=...
```

The frontend must never receive backend secrets such as `JWT_SECRET`, payment secrets, SMTP passwords, or the MongoDB URI.

## 4. Frontend deployment

From `frontend/`:

```bash
npm ci
npm run lint
npm run build
```

Deploy the resulting `dist/` directory to a static hosting provider.

For a separate API origin, set the build-time variable:

```env
VITE_API_URL=https://api.example-ngo.org/api
```

If the frontend and API are served behind the same origin/reverse proxy, leave `VITE_API_URL` unset so the client uses `/api`.

The client uses Axios with `withCredentials: true` because authentication is provided by the backend's HttpOnly cookie.

## 5. Reverse proxy and HTTPS

Terminate TLS at the hosting platform or reverse proxy and forward requests to the Node.js process. Preserve the original host/protocol information required by the platform's proxy configuration.

Production authentication cookies are `Secure` and `SameSite=Strict`. The frontend/backend domain arrangement must therefore be compatible with those cookie settings.

The backend has explicit CORS protection. `FRONTEND_URL` must contain the exact browser origin(s), without a wildcard.

## 6. MongoDB Atlas

Use a dedicated least-privilege application database user. Configure Atlas network access for the deployment environment rather than opening the database unnecessarily to the public internet.

The application connects with Mongoose using:

```text
MONGO_URI + DB_NAME
```

After deployment, verify:

1. `/health` returns HTTP 200.
2. `/ready` returns HTTP 200.
3. A registration/login flow succeeds.
4. `/api/auth/me` returns the authenticated user when the browser sends its cookie.
5. A non-destructive read/write smoke test reaches the expected MongoDB database.

Do not run destructive database commands as part of deployment verification.

## 7. Payments

Use gateway sandbox/test credentials before enabling live payments.

Razorpay order creation and signature verification occur on the backend. The Razorpay secret must remain server-side. Verify the complete payment flow in a test environment before switching to production credentials.

The application currently exposes the Razorpay payment flow through:

```text
POST /api/donations/order
POST /api/donations/verify
```

## 8. Email and PDF/QR features

After deployment, test SMTP-dependent operations with non-production test recipients first. Also verify the PDF receipt and QR/certificate paths that your organization actually uses.

Do not log passwords, JWTs, payment secrets, SMTP passwords, or database credentials while troubleshooting.

## 9. CI quality gates

The repository's production-quality workflow runs on pushes and pull requests for `master` and `production-hardening`.

It verifies:

- repository hygiene
- absence of TypeScript application source under `frontend/src` and `backend/src`
- backend syntax with `npm run check`
- high-severity backend dependency vulnerabilities
- frontend linting
- frontend production build
- existence of `dist/index.html`
- high-severity frontend dependency vulnerabilities

Run the same commands locally before deployment:

```bash
cd backend
npm ci
npm run check
npm audit --audit-level=high

cd ../frontend
npm ci
npm run lint
npm run build
npm audit --audit-level=high
```

## 10. Operational checks after deployment

Perform these checks after every production deployment:

```text
GET /health
GET /ready
POST /api/auth/register      (test account only)
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/news
GET  /api/campaigns
GET  /api/projects
GET  /api/events/upcoming
```

Also test the specific payment, email, certificate, report, admin, volunteer, beneficiary, and event workflows enabled in the deployment.

Confirm browser Network requests use the intended API origin and that no request attempts to use `/graphql`.

## 11. Backups and monitoring

Enable MongoDB Atlas backups appropriate to the data's importance. Verify that backups can actually be restored in a non-production environment.

Monitor at minimum:

- HTTP 5xx rate
- API latency
- `/ready` failures
- MongoDB connection failures
- authentication failure spikes
- payment verification failures
- email delivery failures
- process restarts

## 12. Rollback

Keep the previous known-good deployment artifact/commit available. If a deployment fails health or smoke checks, roll back the application to the previous known-good version and investigate before retrying.

Database schema/data changes should be backward-compatible with the rollback version whenever possible.

## 13. Important limitations of repository-only verification

A GitHub CI pass proves that the checked commands succeed in the CI environment. It does not prove that a deployed frontend can reach a deployed API, that MongoDB Atlas accepts the production credentials, that SMTP delivery works, or that live payment gateways accept production configuration.

Those checks require access to the actual deployment environment and its runtime secrets and must be performed as deployment smoke tests rather than inferred from source code.
