# Frontend-Backend Connection Fixes

## Current state

The frontend and backend now use the intended REST/JSON architecture.

The original connection issue was that several frontend forms were not making real backend requests. The current implementation routes those forms through `frontend/src/lib/apiClient.ts` and persists data through Express routes backed by MongoDB.

## Fixed flows

### Contact
`frontend/src/pages/Contact.tsx` submits to:

```text
POST /api/enquiries
```

### Quick enquiry
`frontend/src/pages/QuickEnquiry.tsx` submits to:

```text
POST /api/enquiries
```

### Get involved
`frontend/src/pages/GetInvolved.tsx` submits to:

```text
POST /api/enquiries
```

The selected interest is included in the enquiry subject.

### Authentication
`frontend/src/contexts/AuthContext.tsx` uses:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

The JWT is delivered in an HttpOnly cookie; the frontend does not store it in localStorage.

### Administrative REST flows
Admin pages use the service methods exposed by `frontend/src/lib/apiClient.ts`, including projects, certificates, enquiries and volunteers.

Volunteer administration uses:

```text
GET    /api/admin/volunteers
POST   /api/admin/volunteers
PATCH  /api/admin/volunteers/:id/status
```

## Data flow

```text
React form/page
     |
     | Axios REST request
     v
Express `/api` route
     |
     | Mongoose
     v
MongoDB
     |
     v
JSON response
     |
     v
React UI state/toast
```

## Configuration

When frontend and backend are deployed separately, set `VITE_API_URL` to the backend base URL. When they are served behind the same origin/proxy, `/api` is the default.

Backend production configuration must provide `FRONTEND_URL` and a strong `JWT_SECRET`.

## Verification

Run backend:

```bash
cd backend
npm run typecheck
npm run build
npm run dev
```

Run frontend:

```bash
cd frontend
npm run lint
npm run build
npm run dev
```

Then verify `/health`, `/ready`, registration/login/logout, enquiry submission and an authenticated admin workflow.

## Notes

Database persistence requires MongoDB. Email delivery requires SMTP configuration. Payment operations require valid sandbox/live gateway credentials.

The former GraphQL connection path is retired and is not part of the current application.