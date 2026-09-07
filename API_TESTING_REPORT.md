# NGO Management System - API Testing Report

## Scope

This repository now uses REST/JSON APIs under `/api`. The previous report was written against the retired GraphQL implementation and is no longer a valid API specification.

## Current REST smoke-test matrix

| Area | Endpoint | Verification requirement |
|---|---|---|
| Health | `GET /health` | Returns HTTP 200 with service status |
| Readiness | `GET /ready` | Returns 200 only when MongoDB is connected |
| Register | `POST /api/auth/register` | Creates a user and sets HttpOnly auth cookie |
| Login | `POST /api/auth/login` | Authenticates valid credentials and sets cookie |
| Current user | `GET /api/auth/me` | Returns the authenticated user |
| Logout | `POST /api/auth/logout` | Clears authentication cookie |
| News | `GET /api/news` | Returns published news |
| Activities | `GET /api/activities` | Returns published activities |
| Campaigns | `GET /api/campaigns` | Returns campaigns |
| Projects | `GET /api/projects` | Returns projects |
| Events | `GET /api/events` | Returns events |
| Internships | `GET /api/internships` | Returns open internships |
| Certificate verification | `GET /api/certificates/verify/:code` | Returns certificate or 404 |
| Enquiry | `POST /api/enquiries` | Validates and persists an enquiry |
| Donation | `POST /api/donations` | Validates and creates donation record |
| User donations | `GET /api/donations/user/history` | Returns the authenticated user's donation history |
| User receipts | `GET /api/receipts/user` | Returns the authenticated user's receipts |
| Admin volunteers | `GET /api/admin/volunteers` | Requires admin authorization |
| Admin volunteer create | `POST /api/admin/volunteers` | Creates volunteer record |
| Admin volunteer status | `PATCH /api/admin/volunteers/:id/status` | Updates volunteer status |

## Automated validation

The repository workflow `.github/workflows/production-quality.yml` runs:

```text
Backend: npm install -> typecheck -> build -> npm audit --audit-level=high
Frontend: npm install -> lint -> build -> npm audit --audit-level=high
```

## Important distinction

A successful build does not prove that MongoDB, SMTP, payment gateways, production CORS/cookies, or the deployed frontend/backend connection work end-to-end. Those checks require the corresponding environment and services.

The old GraphQL test report claiming 15/15 GraphQL tests passed has been retired because those endpoints are no longer part of the application.

## Recommended end-to-end test order

1. Start MongoDB or connect to MongoDB Atlas.
2. Start backend and verify `/health` and `/ready`.
3. Start frontend and confirm `VITE_API_URL`.
4. Register/login and verify `/api/auth/me`.
5. Submit an enquiry and confirm the MongoDB document.
6. Test authenticated donation history/receipts.
7. Test admin volunteer management.
8. Test sandbox payment verification and SMTP separately.
