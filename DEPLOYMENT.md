# Deployment Guide

## Prerequisites

- Git repository set up
- Cloud provider account (Heroku, AWS, DigitalOcean, or Azure)
- MongoDB Atlas account (for cloud database)
- Payment gateway accounts configured
- Email service configured (Gmail OAuth recommended)

## Backend Deployment

### Option 1: Heroku

#### Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create ngo-backend

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ngo
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRY=7d
# Add all other environment variables...

# Deploy
git push heroku main
```

#### Procfile (create in backend root)
```
web: npm start
```

#### Start Script (package.json)
```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Option 2: DigitalOcean App Platform

1. Connect GitHub repository
2. Select backend folder as source
3. Set environment variables
4. Choose Node.js runtime
5. Set build command: `npm install && npm run build`
6. Set run command: `npm start`

### Option 3: AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd NGO/backend

# Install dependencies
npm install

# Build
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start "npm start" --name ngo-backend

# Save PM2 config
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

### Option 4: Docker & Container

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

#### Build & Push
```bash
docker build -t ngo-backend:latest .
docker run -p 4000:4000 --env-file .env ngo-backend:latest
```

## Frontend Deployment

### Option 1: Vercel

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Add environment variables in Vercel dashboard
# VITE_API_URL=https://your-backend.com
```

#### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### Option 2: Netlify

1. Connect GitHub repository
2. Select frontend folder
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

### Option 3: AWS S3 + CloudFront

```bash
# Build application
npm run build

# Create S3 bucket
aws s3 mb s3://ngo-app-bucket

# Upload files
aws s3 sync dist/ s3://ngo-app-bucket/ --delete

# Create CloudFront distribution
# Link to S3 bucket
# Add SSL certificate
# Configure domain routing
```

### Option 4: GitHub Pages

```bash
# Update vite.config.ts
base: '/ngo-app/'

# Build
npm run build

# Push to gh-pages branch
npm run deploy
```

## Database Deployment

### MongoDB Atlas

1. Create account at mongodb.com/cloud
2. Create cluster (free tier available)
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Add to .env: `MONGODB_URI=mongodb+srv://...`

### Database Backup

```bash
# Backup local database
mongodump --db ngo --out ./backup

# Restore from backup
mongorestore ./backup

# Backup from Atlas
mongoexport --db ngo --collection users --out users.json
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
sudo apt-get install certbot

# For standalone
sudo certbot certonly --standalone -d yourdomain.com

# For nginx
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Configure HTTPS

Update backend code:
```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/private-key.pem'),
  cert: fs.readFileSync('/path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

## Environment Variables Setup

Create production `.env` file:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ngo-prod

# Server
PORT=4000
NODE_ENV=production

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRY=7d

# Email
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Razorpay (Production)
RAZORPAY_KEY_ID=prod_key_id
RAZORPAY_KEY_SECRET=prod_key_secret

# PhonePe (Production)
PHONEPE_MERCHANT_ID=prod_merchant_id
PHONEPE_API_KEY=prod_api_key
PHONEPE_API_URL=https://api.phonepe.com

# PayU (Production)
PAYU_MERCHANT_ID=prod_merchant_id
PAYU_MERCHANT_KEY=prod_merchant_key
PAYU_AUTH_HEADER=prod_auth_header

# Organization
ORG_NAME=Your NGO Name
ORG_EMAIL=info@yourdomain.com
ORG_PHONE=+91-XXXXXXXXXX
ORG_ADDRESS=Your Address

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-auto-pull
pm2 install pm2-logrotate

# View logs
pm2 logs ngo-backend

# Monitoring dashboard
pm2 web
```

### Application Logging

```typescript
// Add to backend
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking

```bash
npm install --save sentry
```

Configure Sentry:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

## Performance Optimization

### Database Indexes

```javascript
// Create indexes in MongoDB Atlas
db.users.createIndex({ email: 1 }, { unique: true })
db.memberships.createIndex({ memberId: 1 }, { unique: true })
db.donations.createIndex({ transactionId: 1 }, { unique: true })
db.campaigns.createIndex({ status: 1, endDate: 1 })
db.news.createIndex({ slug: 1 }, { unique: true })
db.activities.createIndex({ createdAt: -1 })
```

### Caching

```typescript
// Redis caching
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Cache campaign data
const cachedCampaigns = await client.get('campaigns');
```

### CDN Setup

For static files:
- Upload images to CDN (Cloudflare, Cloudinary)
- Update references in code
- Set appropriate cache headers

## Scheduled Tasks

### Cron Job Hosting

```bash
# Using EasyCron (free service)
# Set webhook: https://your-api.com/api/cron/birthday-wishes

# Or use AWS Lambda
# Or use DigitalOcean Functions
```

## Database Backup Strategy

### Automated Backups

```bash
# Create backup script (backup.sh)
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net" --out="backup_$TIMESTAMP"
aws s3 cp backup_$TIMESTAMP s3://backup-bucket/ --recursive

# Schedule with cron
0 2 * * * /path/to/backup.sh
```

## Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Setup rate limiting
- [ ] Enable CORS for trusted domains only
- [ ] Remove console.log from production
- [ ] Setup error logging
- [ ] Enable database backups
- [ ] Setup monitoring alerts
- [ ] Regularly update dependencies
- [ ] Use environment variables for secrets
- [ ] Setup email verification
- [ ] Configure payment gateway sandboxes for testing

## Post-Deployment

1. Test all features in production
2. Verify email sending
3. Test payment gateways
4. Check PDF generation
5. Verify QR code generation
6. Test file uploads
7. Monitor error logs
8. Load test critical endpoints
9. Setup monitoring alerts
10. Create incident response plan

## Rollback Procedure

```bash
# Heroku
heroku releases
heroku rollback v10

# DigitalOcean
# Redeploy from previous commit
git revert HEAD
git push

# Docker
docker ps
docker run -d -p 4000:4000 ngo-backend:previous-tag
```

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs
# or Vercel dashboard
# or Heroku logs -t

# Common issues:
# - Missing environment variables
# - Database connection error
# - Port already in use
```

### Database connection timeout
```bash
# Check MongoDB Atlas whitelist
# Verify connection string
# Check network connectivity
# Try local connection first
```

### Payment gateway not working
```bash
# Verify API keys in .env
# Check if production/sandbox mode is correct
# Verify merchant ID
# Check webhook URLs
```

## Maintenance

### Regular Tasks

- Monitor error logs weekly
- Review performance metrics monthly
- Update dependencies quarterly
- Backup database weekly
- Test backup restoration quarterly
- Review security logs monthly

### Update Dependencies

```bash
npm outdated
npm update
npm audit fix
```

---

For detailed provider-specific documentation, refer to:
- [Heroku Docs](https://devcenter.heroku.com/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [AWS Docs](https://docs.aws.amazon.com/)
