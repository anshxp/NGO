# NGO Management System - Feature Checklist

This checklist describes the current MERN + REST implementation on `production-hardening`.

## Core modules

### 1. Membership Management
- [x] Online registration and validation
- [x] Membership status management
- [x] Renewal and suspension flows
- [x] ID-card / QR generation support
- [x] Administrative membership management

### 2. Payment Gateways
- [x] Razorpay integration
- [x] PhonePe integration utilities
- [x] PayU integration utilities
- [x] Payment status handling
- [x] Server-side payment verification

### 3. Donation Management
- [x] Donation creation
- [x] Razorpay order creation
- [x] Payment verification
- [x] Donation history
- [x] Administrative donation management
- [x] Receipt generation support

### 4. Certificate Management
- [x] Member certificates
- [x] Visitor certificates
- [x] Verification-code lookup
- [x] Administrative issuance

### 5. Campaign Management
- [x] Public campaign listing
- [x] Active campaign listing
- [x] Campaign creation/update/close
- [x] Campaign donation endpoint

### 6. Project Management
- [x] Public project listing
- [x] Project detail endpoint
- [x] Administrative project creation
- [x] Expense and beneficiary administration
- [x] Project report endpoint

### 7. Event Management
- [x] Public event listing
- [x] Upcoming events
- [x] Event detail
- [x] Administrative event creation
- [x] Event registration endpoint

### 8. Internship Management
- [x] Public internship listing
- [x] Internship detail
- [x] Administrative internship creation
- [x] Application endpoint

### 9. News & Blog
- [x] Published news listing
- [x] News detail by slug
- [x] Administrative CRUD operations
- [x] Publish workflow

### 10. Activity Feed
- [x] Public activity listing
- [x] Activity detail
- [x] Administrative creation/deletion
- [x] Like and comment endpoints

### 11. Enquiry Management
- [x] Public enquiry submission
- [x] Administrative listing/detail
- [x] Status updates
- [x] Replies
- [x] Deletion

### 12. Message Broadcasting
- [x] Administrative message creation
- [x] Scheduled messages
- [x] Message listing/detail
- [x] Message deletion

### 13. Beneficiary Management
- [x] Administrative listing/detail
- [x] Create/update
- [x] Search
- [x] Help-history tracking

### 14. Report Generation
- [x] Membership report
- [x] Donation report
- [x] Project report
- [x] Beneficiary report
- [x] Expense report
- [x] Income-vs-expense report

### 15. Receipt Management
- [x] Administrative receipt listing
- [x] User receipt listing
- [x] Filtering by type
- [x] Create and void operations

### 16. Authentication & Authorization
- [x] Registration
- [x] Login/logout
- [x] Current-user lookup
- [x] JWT authentication
- [x] HttpOnly authentication cookie
- [x] Role-based authorization

### 17. Automated Services
- [x] Scheduled background jobs
- [x] Email service
- [x] PDF generation
- [x] QR code generation

## API architecture

The frontend communicates with the backend through `frontend/src/lib/apiClient.ts`. The backend exposes REST/JSON routes from `backend/src/routes` under `/api`.

GraphQL is intentionally not part of the runtime architecture, frontend client, dependencies, or active project documentation.

## Verification requirements

Run:

```bash
# backend
cd backend
npm install
npm run typecheck
npm run build

# frontend
cd ../frontend
npm install
npm run lint
npm run build
```

Environment-dependent flows such as MongoDB, SMTP and payment gateways require their respective credentials and services before they can be exercised end-to-end.
