# Volunteer Management System

## Overview

The NGO management system provides administrative volunteer registration and lifecycle management through the REST API.

## Backend

The volunteer data model is `backend/src/schema/volunteer.ts`.

Administrative endpoints are exposed under `/api/admin/volunteers`:

```text
GET    /api/admin/volunteers
POST   /api/admin/volunteers
PATCH  /api/admin/volunteers/:id/status
PATCH  /api/admin/volunteers/:id/hours
PATCH  /api/admin/volunteers/:id/background
POST   /api/admin/volunteers/:id/tasks
DELETE /api/admin/volunteers/:id
```

These routes require authentication and administrator authorization through the existing Express middleware.

## Registration payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "education": "Bachelor's degree",
  "skills": ["Teaching", "Counseling"],
  "experience": "2 years",
  "areaOfInterest": ["Education", "Community Development"],
  "availability": "weekends",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "9876543211",
  "emergencyContactRelationship": "Sister"
}
```

The server generates the volunteer ID, initializes the volunteer status, joining date, hours and background verification state.

## Frontend

`frontend/src/pages/AdminVolunteers.tsx` uses `volunteerAPI` from `frontend/src/lib/apiClient.ts` for listing, registration and status updates.

Authentication is cookie-based. The frontend does not need to construct or persist JWT Authorization headers manually.

## Security

- Admin-only routes are protected by Express authentication/authorization middleware.
- Volunteer input is validated on the server.
- Identifiers are validated before database operations.
- Secrets are not accepted from the frontend for volunteer operations.

## Testing

Run the frontend lint/build and backend typecheck/build commands before deployment. For a functional smoke test, create a volunteer through the admin page and verify the document appears in MongoDB and status changes persist after reload.

## Architecture

```text
Admin React page
      |
      | REST / JSON
      v
Express /api/admin/volunteers
      |
      | Mongoose
      v
MongoDB
```
