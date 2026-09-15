# NGO Management System

A comprehensive MERN web application for managing non-governmental organization operations including memberships, donations, projects, events, and administrative functions.

## Core features

- Membership management with ID cards and QR codes
- Donation management with Razorpay, PhonePe, and PayU integrations
- Certificate management and QR verification
- Campaign and crowdfunding management
- Project and expense management
- Event management and registration
- Internship programs and applications
- News and activity feed
- Visitor enquiries and administration
- Member messaging and broadcasting
- Beneficiary tracking and help-history auditing
- Report generation
- Role-based access control
- 80G tax receipt generation

## Technology

- React
- Node.js
- Express.js
- MongoDB with Mongoose
- REST/JSON APIs
- JWT authentication
- Nodemailer
- PDFKit
- QR code generation

The application intentionally uses a straightforward MERN + REST architecture. GraphQL is not part of the application.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

For production:

```bash
npm install
npm run build
npm start
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

For production:

```bash
npm run build
```

Configure `VITE_API_URL` to point to the deployed REST API.

## Security

Production configuration includes security headers, CORS restrictions, request limits, rate limiting, authentication and authorization middleware, origin protection for cookie-authenticated mutations, audit middleware, and production environment validation.

Secrets must remain in environment variables and must never be committed to the repository.

## API

The application exposes REST/JSON endpoints under `/api`. Health and readiness endpoints are provided by the backend. There is no `/graphql` endpoint.

## Database

MongoDB is the application database and Mongoose is used for data access and schema validation.

## License

MIT
