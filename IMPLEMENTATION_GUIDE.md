# NGO Management System - Implementation Guide

## Project Overview
Complete NGO management web application with membership, donations, certificates, campaigns, projects, and admin dashboard.

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **API**: GraphQL
- **Authentication**: JWT
- **Payment Gateways**: Razorpay, PhonePe, PayU Money
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **QR Codes**: qrcode

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Data Fetching**: Axios
- **Charts**: Recharts

## Project Structure

```
backend/
├── src/
│   ├── connection/
│   │   └── db.ts                 # Database connection
│   ├── graphql/
│   │   ├── resolvers/            # GraphQL resolvers for all features
│   │   └── typeDefs/             # GraphQL type definitions
│   ├── middleware/
│   │   ├── auth.ts               # Auth middleware
│   │   └── apiMiddleware.ts      # API middleware
│   ├── schema/                   # MongoDB schemas
│   │   ├── user.ts
│   │   ├── membership.ts
│   │   ├── certificate.ts
│   │   ├── donation.ts
│   │   ├── campaign.ts
│   │   ├── project.ts
│   │   ├── event.ts
│   │   ├── internship.ts
│   │   ├── beneficiary.ts
│   │   ├── message.ts
│   │   ├── receipt.ts
│   │   ├── news.ts
│   │   ├── activity.ts
│   │   ├── enquiry.ts
│   │   ├── expense.ts
│   │   └── eventRegistration.ts
│   └── utils/
│       ├── auth.ts               # Auth utilities
│       ├── email.ts              # Email templates
│       ├── qrcode.ts             # QR code generation
│       ├── pdfGenerator.ts       # PDF generation
│       ├── razorpay.ts           # Razorpay integration
│       ├── phonepe.ts            # PhonePe integration
│       ├── payu.ts               # PayU integration
│       ├── helpers.ts            # Helper functions
│       ├── authContext.ts        # Auth context utilities
│       ├── tokenManager.ts       # JWT token management
│       └── cronJobs.ts           # Scheduled tasks

frontend/
├── src/
│   ├── pages/
│   │   ├── Membership.tsx
│   │   ├── Campaigns.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── QuickEnquiry.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminEnquiries.tsx
│   │   ├── AdminMessages.tsx
│   │   ├── AdminReceipts.tsx
│   │   ├── AdminNews.tsx
│   │   ├── AdminBeneficiaries.tsx
│   │   └── AdminReports.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── apiClient.ts          # API client with all endpoints
│   │   ├── api.ts
│   │   ├── graphqlClient.ts
│   │   └── utils.ts
│   └── hooks/
│       └── use-toast.ts
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB running locally or remote connection string
- Payment gateway accounts (Razorpay, PhonePe, PayU)
- SMTP credentials for email

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - MongoDB connection
# - JWT secret
# - Email credentials
# - Payment gateway keys

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
VITE_API_URL=http://localhost:4000

# Run development server
npm run dev

# Build for production
npm run build
```

## Features Implementation

### 1. Membership Management
- Online registration form
- Automatic ID card generation with QR code
- PDF membership receipt with QR code
- Membership renewal system
- Referral tracking
- Birthday wishes automation

**Resolvers**: `membershipResolvers.ts`
**Frontend**: `pages/Membership.tsx`

### 2. Donation Management
- Multiple payment gateways (Razorpay, PhonePe, PayU)
- Automatic 80G receipt generation
- QR code on receipts
- Donation referral tracking
- Campaign-based donations
- Cash donation entry

**Resolvers**: `donateResolvers.ts`, `campaignResolvers.ts`
**Payment Utils**: `razorpay.ts`, `phonepe.ts`, `payu.ts`

### 3. Certificate Management
- Achievement certificates for members
- Visitor certificates with 6 templates
- QR code verification system
- Auto-email with PDF
- Verification code tracking

**Resolvers**: `certificateResolvers.ts`
**Frontend**: Certificate verification page

### 4. News & Activity Feed
- News management (create, publish, archive)
- Activity feed like Facebook
- Like and comment functionality
- Image support
- Full-text search

**Resolvers**: `newsResolvers.ts`, activity functionality in newsResolvers.ts
**Frontend**: `pages/AdminNews.tsx`

### 5. Campaign Management
- Campaign creation with goal and duration
- Real-time donation tracking
- Progress bar
- Donor list
- Auto-email updates
- Campaign status management

**Resolvers**: `campaignResolvers.ts`
**Frontend**: `pages/Campaigns.tsx`

### 6. Project Management
- Project creation with budget tracking
- Expense tracking by category
- Beneficiary management
- Fund allocation tracking
- Reports generation

**Resolvers**: `projectResolvers.ts`, `beneficiaryResolvers.ts`
**Frontend**: `pages/AdminBeneficiaries.tsx`

### 7. Event Management
- Event creation (free and paid)
- Online registration
- QR ticket generation
- Event report
- Participant tracking

**Resolvers**: `eventResolvers.ts`
**Frontend**: Event registration page

### 8. Internship Management
- Internship posting
- Student applications
- Selection tracking
- Completion certificates

**Resolvers**: `internshipResolvers.ts`

### 9. Enquiry Management
- Quick enquiry form
- Admin panel for responses
- Auto-response email
- Status tracking
- Search and filter

**Resolvers**: `enquiryResolvers.ts`
**Frontend**: `pages/QuickEnquiry.tsx`, `pages/AdminEnquiries.tsx`

### 10. Message Broadcasting
- Send messages to individual members
- Broadcast to all members
- Scheduled messages
- Email + Dashboard notification
- Read tracking

**Resolvers**: `messageResolvers.ts`
**Frontend**: `pages/AdminMessages.tsx`

### 11. Receipt Management
- Centralized receipt view
- Multiple receipt types (membership, donation, event, cash)
- QR code verification
- PDF download

**Resolvers**: `receiptResolvers.ts`
**Frontend**: `pages/AdminReceipts.tsx`

### 12. Report Generation
- Membership reports
- Donation reports
- Project reports
- Beneficiary reports
- Expense reports
- Income vs Expense report
- PDF export

**Frontend**: `pages/AdminReports.tsx`

## API Endpoints

### Authentication
```
POST /auth/login
POST /auth/register
POST /auth/logout
GET /auth/me
```

### Membership
```
POST /membership/register
GET /membership
GET /membership/:id
POST /membership/:id/renew
```

### Donations
```
GET /donations
POST /donations
POST /donations/verify
GET /donations/user/history
```

### Certificates
```
GET /certificates
GET /certificates/visitor
GET /certificates/verify/:code
POST /certificates/issue
```

### News & Activity
```
GET /news
GET /news/:slug
POST /news
PUT /news/:id
POST /news/:id/publish
DELETE /news/:id
GET /activities
POST /activities
POST /activities/:id/like
POST /activities/:id/comment
```

### Campaigns
```
GET /campaigns
GET /campaigns/:id
GET /campaigns/active
POST /campaigns
POST /campaigns/:id/donate
```

### Projects
```
GET /projects
GET /projects/:id
POST /projects
POST /projects/:id/expense
GET /projects/:id/reports
```

### Events
```
GET /events
GET /events/:id
GET /events/upcoming
POST /events
POST /events/:id/register
```

### Enquiries
```
POST /enquiries
GET /enquiries
GET /enquiries/:id
POST /enquiries/:id/reply
```

### Messages
```
GET /messages
GET /messages/:id
POST /messages
POST /messages/schedule
```

### Reports
```
GET /reports/membership
GET /reports/donations
GET /reports/projects
GET /reports/expenses
GET /reports/income-expense
```

## GraphQL Queries & Mutations

All features are also available via GraphQL endpoint at `/graphql`

Example Query:
```graphql
query GetMemberships {
  getMemberships {
    id
    memberId
    membershipStatus
    joiningDate
  }
}
```

Example Mutation:
```graphql
mutation RegisterMembership($userId: String!, $designationId: String!, $fee: Float!) {
  registerMembership(
    userId: $userId
    designationId: $designationId
    membershipFee: $fee
  ) {
    id
    memberId
    success
    message
  }
}
```

## Utilities

### Email Templates
All email templates in `src/utils/email.ts`:
- Donation receipt
- Membership receipt
- Birthday wishes
- Certificate notification
- Event registration
- Message notification
- Enquiry response
- Campaign update

### PDF Generators
In `src/utils/pdfGenerator.ts`:
- Membership ID card
- Certificate
- Appointment letter
- 80G receipt
- Reports

### QR Code Generation
In `src/utils/qrcode.ts`:
- Generate QR from data
- File output
- Buffer output
- Data URL output

### Helper Functions
In `src/utils/helpers.ts`:
- ID generators
- Validators
- Formatters
- Date utilities
- Progress calculation

## Authentication & Authorization

### Roles
- **Admin**: Full access
- **Member**: Membership features, donations, events
- **Volunteer**: Limited member features
- **Guest**: Public pages only

### Token Management
JWT tokens with 7-day expiry by default
Tokens stored in localStorage on frontend
Refresh handled automatically by middleware

## Cron Jobs

Automated tasks in `src/utils/cronJobs.ts`:
- Daily birthday wishes at 8 AM
- Campaign deadline checks every hour
- Membership renewal reminders daily at 9 AM
- Scheduled message sending every 5 minutes

## Payment Integration

### Razorpay
- Production ready
- Signature verification
- Payment status polling

### PhonePe
- Test and production mode
- Hash-based signature
- Status verification

### PayU Money
- Hash-based security
- Form submission integration
- Payment verification

## Deployment

### Backend Deployment (Heroku/AWS/DigitalOcean)
```bash
npm run build
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Environment Variables
Set all `.env.example` variables in production platform

## Security Considerations

1. **JWT Secret**: Use strong random string
2. **CORS**: Configure for your domain
3. **Rate Limiting**: Implement for API endpoints
4. **Input Validation**: All inputs validated
5. **HTTPS**: Use SSL in production
6. **Email**: Use OAuth for sensitive operations

## Database Indexes

Recommended indexes for performance:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.memberships.createIndex({ memberId: 1 }, { unique: true })
db.donations.createIndex({ transactionId: 1 }, { unique: true })
db.campaigns.createIndex({ status: 1 })
```

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in .env
- Verify app password for Gmail
- Check firewall/port 587

### Payment Gateway Issues
- Verify API keys
- Check merchant ID
- Test mode vs production
- Network connectivity

### Database Connection
- Check MongoDB URI
- Verify network access
- Check database name

## Future Enhancements

1. WhatsApp integration for notifications
2. Multi-language support
3. Mobile app (React Native)
4. Advanced analytics
5. Video streaming for events
6. Integration with tally/accounting software
7. RFID card support
8. SMS notifications

## Support

For issues or feature requests, please open an issue in the repository.
