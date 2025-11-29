# NGO Management System - Getting Started Checklist

## ✅ Pre-Deployment Setup

### Environment Configuration

- [ ] Copy `.env.example` to `.env` in backend directory
- [ ] Set `MONGODB_URI` to your MongoDB connection string
- [ ] Generate strong `JWT_SECRET` (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Set `JWT_EXPIRY` (recommended: '7d')
- [ ] Configure email credentials:
  - [ ] Set `EMAIL_USER` (your email address)
  - [ ] Set `EMAIL_PASSWORD` (Gmail App Password recommended)
  - [ ] Set `SMTP_HOST` (smtp.gmail.com for Gmail)
  - [ ] Set `SMTP_PORT` (587 for Gmail)
- [ ] Add Razorpay credentials:
  - [ ] `RAZORPAY_KEY_ID`
  - [ ] `RAZORPAY_KEY_SECRET`
- [ ] Add PhonePe credentials:
  - [ ] `PHONEPE_MERCHANT_ID`
  - [ ] `PHONEPE_API_KEY`
  - [ ] `PHONEPE_API_URL`
- [ ] Add PayU credentials:
  - [ ] `PAYU_MERCHANT_ID`
  - [ ] `PAYU_MERCHANT_KEY`
  - [ ] `PAYU_AUTH_HEADER`
- [ ] Set Organization details:
  - [ ] `ORG_NAME`
  - [ ] `ORG_EMAIL`
  - [ ] `ORG_PHONE`
  - [ ] `ORG_ADDRESS`
- [ ] Configure frontend `.env.local`:
  - [ ] Set `VITE_API_URL` (backend URL)

### Database Setup

- [ ] Create MongoDB database (Atlas recommended)
- [ ] Create database user with strong password
- [ ] Whitelist IP addresses in MongoDB Atlas
- [ ] Test connection: `mongosh "your-connection-string"`
- [ ] Create database indexes:
  ```bash
  # Run these in MongoDB shell
  db.users.createIndex({ email: 1 }, { unique: true })
  db.memberships.createIndex({ memberId: 1 }, { unique: true })
  db.donations.createIndex({ transactionId: 1 }, { unique: true })
  db.campaigns.createIndex({ status: 1, endDate: 1 })
  db.news.createIndex({ slug: 1 }, { unique: true })
  ```

### Email Setup (Gmail)

- [ ] Enable 2-factor authentication in Gmail
- [ ] Generate App Password: https://myaccount.google.com/apppasswords
- [ ] Copy App Password to `EMAIL_PASSWORD` in `.env`
- [ ] Test email sending (optional)

### Payment Gateway Setup

#### Razorpay
- [ ] Create Razorpay account at https://razorpay.com
- [ ] Get API keys from Dashboard → Settings → API Keys
- [ ] Copy keys to `.env`
- [ ] Test in sandbox mode first

#### PhonePe
- [ ] Create PhonePe merchant account
- [ ] Get Merchant ID and API Key
- [ ] Copy credentials to `.env`
- [ ] Start with test mode (`apiUrl = test`)

#### PayU Money
- [ ] Create PayU merchant account
- [ ] Get Merchant ID and Merchant Key
- [ ] Copy credentials to `.env`
- [ ] Enable test mode initially

## 🚀 Installation & Running

### Backend Installation

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Verify packages installed
npm ls | grep -E "qrcode|jsonwebtoken|axios"

# 3. Build TypeScript
npm run build

# 4. Check for errors
npx tsc --noEmit

# 5. Start development server
npm run dev

# 6. Verify server started
# Should see: "Server running on port 4000"
```

### Frontend Installation

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
echo "VITE_API_URL=http://localhost:4000" > .env.local

# 3. Start development server
npm run dev

# 4. Verify frontend started
# Should see: "VITE v4.x.x  ready in xxx ms"
# Open http://localhost:5173
```

## 🧪 Testing Checklist

### Backend Testing

- [ ] GraphQL endpoint accessible: `http://localhost:4000/graphql`
- [ ] Test query (copy to GraphQL playground):
  ```graphql
  query {
    getMemberships {
      id
      memberId
    }
  }
  ```
- [ ] Test mutation (user creation):
  ```graphql
  mutation {
    registerMembership(
      userId: "test"
      designationId: "des-1"
      membershipFee: 500
    ) {
      id
      success
    }
  }
  ```
- [ ] Verify database connection works
- [ ] Check console for errors
- [ ] Verify cron jobs started (check logs)

### Email Testing

- [ ] Test email sending:
  ```typescript
  // Add to backend/src/index.ts temporarily
  sendMembershipReceipt({
    email: 'your-email@gmail.com',
    name: 'Test User',
    membershipId: 'TEST-001',
    membershipFee: 500
  });
  ```
- [ ] Check inbox for receipt email
- [ ] Verify email HTML formatting
- [ ] Delete test email

### QR Code Testing

- [ ] Check QR codes generated in `/qrcodes` directory
- [ ] Test QR code verification endpoint
- [ ] Scan generated QR code with phone camera

### Payment Gateway Testing

#### Razorpay
- [ ] Create test payment
- [ ] Use test card: 4111 1111 1111 1111
- [ ] Expiry: Any future date
- [ ] CVV: Any 3 digits
- [ ] Verify payment recorded in database

#### PhonePe
- [ ] Create test order
- [ ] Verify order ID generated
- [ ] Check test payment status

#### PayU
- [ ] Create test order
- [ ] Verify order hash generated
- [ ] Test payment verification

### PDF Generation Testing

- [ ] Generate membership ID card
- [ ] Generate certificate
- [ ] Generate 80G receipt
- [ ] Check files created in PDFs directory
- [ ] Verify QR codes included
- [ ] Test PDF download link

### Frontend Testing

- [ ] Access http://localhost:5173
- [ ] Test navigation between pages
- [ ] Test form submissions
- [ ] Verify API calls in Network tab
- [ ] Check error handling
- [ ] Test authentication flow

## 📊 Database Verification

After setup, verify collections exist:

```bash
# Connect to MongoDB
mongosh "your-connection-string"

# List databases
show databases

# Select your database
use ngo

# List collections
show collections

# Verify key collections
db.users.countDocuments()
db.memberships.countDocuments()
db.campaigns.countDocuments()
```

## 🔒 Security Checklist

- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] Database password is strong
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to git
- [ ] CORS configured for your domain
- [ ] HTTPS enabled (in production)
- [ ] Rate limiting configured (production)
- [ ] SQL injection prevention checked
- [ ] CSRF protection enabled
- [ ] Sensitive data not logged

## 🚢 Pre-Production Checklist

### Code Quality

- [ ] TypeScript compilation without errors: `npm run build`
- [ ] No console.log in production code
- [ ] All error cases handled
- [ ] Input validation on all endpoints
- [ ] No hardcoded secrets

### Performance

- [ ] Database indexes created
- [ ] Images optimized
- [ ] API response times acceptable
- [ ] No N+1 queries
- [ ] Caching implemented

### Testing

- [ ] Unit tests pass (if applicable)
- [ ] Integration tests pass
- [ ] End-to-end tests pass
- [ ] Manual testing completed
- [ ] Load testing performed

### Documentation

- [ ] README.md up to date
- [ ] API documentation complete
- [ ] Deployment guide prepared
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

### Deployment

- [ ] Deployment target selected
- [ ] Domain configured
- [ ] SSL certificate obtained
- [ ] Database backups configured
- [ ] Monitoring tools setup
- [ ] Logging configured
- [ ] Alerting configured

## 📋 Production Environment Variables

Required for production deployment:

```env
# Critical - Must be set
MONGODB_URI=<production-database-uri>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production

# Email (for notifications)
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>

# Payment Gateways (choose at least one)
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>

# Frontend
VITE_API_URL=<production-api-url>

# Optional but recommended
SENTRY_DSN=<error-tracking>
REDIS_URL=<caching>
LOG_LEVEL=info
```

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check Node version
node --version  # Should be 16+

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 4000 availability
lsof -i :4000

# Check for TypeScript errors
npm run build

# View error logs
npm run dev 2>&1 | head -50
```

### Database connection failed

```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check if MongoDB is running
ps aux | grep mongod

# Verify connection string format
# Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Check IP whitelist in MongoDB Atlas
# Add your current IP: Settings → Network Access
```

### Email not sending

```bash
# Verify SMTP credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Gmail-specific:
# 1. Enable 2FA
# 2. Generate App Password
# 3. Use App Password (not regular password)

# Test with simple nodemailer
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'your-email', pass: 'app-password' }
});
transporter.verify((error, success) => {
  if (error) console.log(error);
  else console.log('Email ready');
});
"
```

### Payment gateway issues

```bash
# Razorpay: Verify API keys
# PhonePe: Check merchant status
# PayU: Verify hash generation

# Test payment flow manually
# Use sandbox credentials
# Check webhook logs
```

### QR code not generating

```bash
# Verify qrcode package installed
npm ls qrcode

# Check /qrcodes directory exists
ls -la qrcodes/

# Check file permissions
chmod 755 qrcodes/

# Verify QR code generation works
node -e "
const QRCode = require('qrcode');
QRCode.toDataURL('test', (err, url) => {
  console.log(err ? 'Error' : 'Success');
});
"
```

## 📞 Support Resources

- GraphQL Playground: http://localhost:4000/graphql
- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Tailwind Docs: https://tailwindcss.com/docs

## ✨ Next Steps After Setup

1. **Test all features**
   - Create test user
   - Register membership
   - Create campaign
   - Submit enquiry
   - Generate reports

2. **Configure organization details**
   - Upload logo
   - Set organization email
   - Configure address
   - Setup contact information

3. **Create initial content**
   - Add news articles
   - Create campaigns
   - Setup events
   - Add beneficiaries

4. **Setup user management**
   - Create admin account
   - Create sample member accounts
   - Setup designations
   - Configure roles

5. **Test integrations**
   - Send test email
   - Process test payment
   - Generate QR codes
   - Create PDFs

6. **Setup monitoring**
   - Configure error tracking
   - Setup logging
   - Enable performance monitoring
   - Create backup schedule

## 📈 Performance Targets

After deployment, aim for:

- GraphQL query response: < 200ms
- Page load time: < 2s
- Database query: < 100ms
- Email sending: < 5s
- PDF generation: < 10s
- QR code generation: < 1s

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Backup strategy tested
- [ ] Monitoring active
- [ ] Support plan ready
- [ ] Launch announcement prepared
- [ ] Post-launch support scheduled

---

**Total Setup Time**: ~2-3 hours (depending on familiarity with stack)  
**Last Updated**: December 2024  
**Status**: Ready for deployment
