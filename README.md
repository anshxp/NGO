# NGO Management System

A comprehensive web application for managing non-governmental organization operations including memberships, donations, projects, events, and administrative functions.

## 🎯 Features

### Core Features
- **Membership Management** - Online registration with ID card generation and QR codes
- **Donation Management** - Multiple payment gateway support (Razorpay, PhonePe, PayU)
- **Certificate Management** - Achievement certificates with QR verification
- **Campaign Management** - Crowdfunding campaigns with real-time progress tracking
- **Project Management** - Project creation with expense tracking and beneficiary management
- **Event Management** - Event creation and online registration system
- **Internship Programs** - Internship posting and student application management
- **News & Activity Feed** - Social media-like activity feed with likes and comments
- **Enquiry Management** - Visitor enquiries with admin response system
- **Message Broadcasting** - Send targeted or broadcast messages to members
- **Beneficiary Tracking** - Manage beneficiaries with help history audit trail
- **Report Generation** - Export membership, donation, project, and expense reports
- **Role-Based Access Control** - Admin, Member, Volunteer, and Guest roles
- **Tax Receipt Generation** - Automatic 80G receipt generation with QR codes

### Technical Features
- JWT-based authentication
- GraphQL API with type safety
- Automated email notifications
- Cron jobs for automation
- QR code generation and verification
- PDF generation for certificates and receipts
- Multi-payment gateway integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

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

# Create environment file
echo "VITE_API_URL=http://localhost:4000" > .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── connection/      # Database connection setup
│   ├── graphql/         # GraphQL resolvers and type definitions
│   ├── middleware/      # Express middleware (auth, error handling)
│   ├── schema/          # MongoDB models (15 schemas total)
│   └── utils/           # Utility functions and integrations
│       ├── auth.ts              # Authentication utilities
│       ├── email.ts             # Email templates
│       ├── qrcode.ts            # QR code generation
│       ├── pdfGenerator.ts      # PDF generation
│       ├── phonepe.ts           # PhonePe payment
│       ├── payu.ts              # PayU Money payment
│       ├── helpers.ts           # Helper functions
│       ├── authContext.ts       # Auth context utilities
│       ├── tokenManager.ts      # JWT token management
│       └── cronJobs.ts          # Automated tasks

frontend/
├── src/
│   ├── pages/           # React pages (11 pages total)
│   ├── components/      # React components
│   ├── lib/
│   │   └── apiClient.ts # API client with 12 service modules
│   └── hooks/           # Custom React hooks
```

## 🔌 Database Schemas

### 15 MongoDB Collections

1. **User** - User accounts with roles and permissions
2. **Membership** - Member registrations with fees
3. **Certificate** - Issued certificates with verification
4. **VisitorCertificate** - Visitor certificates (6 templates)
5. **News** - Organization news articles
6. **Campaign** - Crowdfunding campaigns
7. **Activity** - Social media activity feed
8. **Enquiry** - Visitor enquiries
9. **Project** - Projects with budget tracking
10. **Event** - Events and registrations
11. **Internship** - Internship programs
12. **Expense** - Expense tracking
13. **Beneficiary** - Beneficiary information
14. **Message** - Member messages
15. **Receipt** - Unified receipt management

## 🔐 Authentication

- JWT-based authentication with 7-day token expiry
- Role-based access control (Admin, Member, Volunteer)
- Token refresh mechanism
- Email verification on signup

## 💳 Payment Gateways

### Razorpay
- Production ready
- Webhook support
- Signature verification

### PhonePe
- Test and production mode
- SHA256 hash-based security
- Real-time status verification

### PayU Money
- Hash-based payment verification
- Sandbox and production mode

## 📧 Email Templates

Automated email notifications for:
- Membership registration and renewal
- Donation receipts
- Certificate issuance
- Event registration
- Birthday wishes
- Campaign updates
- Message notifications
- Enquiry responses

## 🤖 Automated Tasks (Cron Jobs)

- Birthday wishes (Daily at 8 AM)
- Campaign deadline checks (Hourly)
- Membership renewal reminders (Daily at 9 AM)
- Scheduled message sending (Every 5 minutes)

## 📊 Admin Dashboard

Features in AdminDashboard:
- Overview statistics (members, donations, campaigns, beneficiaries)
- Donation trends (line chart)
- Donation distribution (pie chart)
- Income vs Expense report

## 🔧 API Endpoints

### GraphQL Endpoint
- `POST /graphql` - GraphQL queries and mutations

### REST API (Optional)
All features can also be accessed via REST endpoints following the GraphQL structure.

## 🛠️ Configuration

Create `.env` file with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ngo

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# PhonePe
PHONEPE_MERCHANT_ID=your-merchant-id
PHONEPE_API_KEY=your-api-key
PHONEPE_API_URL=https://api.phonepe.com

# PayU
PAYU_MERCHANT_ID=your-merchant-id
PAYU_MERCHANT_KEY=your-merchant-key
PAYU_AUTH_HEADER=your-auth-header

# Organization
ORG_NAME=Your NGO Name
ORG_EMAIL=info@ngo.org
ORG_PHONE=+91-XXXXXXXXXX
ORG_ADDRESS=Your Address

# Frontend
VITE_API_URL=http://localhost:4000
```

## 📦 Frontend Pages

### User Pages (Public/Member)
- **Membership.tsx** - Member registration form
- **Campaigns.tsx** - Campaign listing with donation
- **ActivityFeed.tsx** - Social media feed
- **QuickEnquiry.tsx** - Enquiry submission

### Admin Pages
- **AdminDashboard.tsx** - Dashboard with statistics
- **AdminEnquiries.tsx** - Enquiry management
- **AdminMessages.tsx** - Message broadcasting
- **AdminReceipts.tsx** - Receipt viewer
- **AdminNews.tsx** - News management
- **AdminBeneficiaries.tsx** - Beneficiary management
- **AdminReports.tsx** - Report generation

## 🎨 UI Components

Built with shadcn/ui and Radix UI:
- Forms, buttons, cards, dialogs
- Data tables with sorting and filtering
- Charts (line, pie, bar)
- Responsive design with Tailwind CSS
- Toast notifications

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for responsive layouts
- Mobile-optimized forms and tables
- Touch-friendly UI

## 🔒 Security

- Input validation and sanitization
- SQL injection prevention (MongoDB)
- CORS configuration
- JWT token verification
- Rate limiting ready (implement in production)
- HTTPS recommended

## 🧪 Testing

Recommended testing approach:
```bash
# Backend
npm test

# Frontend
npm run test
```

## 📈 Performance Optimization

- GraphQL query optimization
- Database indexing
- Image optimization
- Lazy loading components
- Caching strategies

## 🚢 Deployment

### Backend (Heroku/AWS/DigitalOcean)
```bash
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Database
- MongoDB Atlas for cloud hosting
- Indexes configured for performance

## 📚 API Documentation

### GraphQL Types Example

```graphql
type Membership {
  id: ID!
  memberId: String!
  userId: ID!
  membershipStatus: String!
  membershipFee: Float!
  joiningDate: String!
  qrCode: String
  idCardUrl: String
}

type Campaign {
  id: ID!
  title: String!
  goal: Float!
  raised: Float!
  startDate: String!
  endDate: String!
  status: String!
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For support, email support@ngo.org or open an issue in the repository.

## 🔄 Version History

### v1.0.0 (Current)
- Complete NGO management system
- 15 database schemas
- 8 GraphQL resolver modules
- 11 frontend pages
- 4 automated cron jobs
- Multi-payment gateway support
- Comprehensive PDF generation
- Email notification system

## 🙏 Acknowledgments

Built with:
- Express.js
- MongoDB & Mongoose
- GraphQL
- React with TypeScript
- shadcn/ui
- Tailwind CSS
- PDFKit
- Nodemailer

---

**Last Updated**: December 2024  
**Maintained by**: NGO Team  
**Status**: Active Development
