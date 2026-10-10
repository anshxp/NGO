import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../connection/db.js';
import { UserModel } from '../schema/user.js';
import { hashPassword, generateReferralCode } from '../utils/auth.js';

const required = ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_PHONE'];
const missing = required.filter((key) => !String(process.env[key] || '').trim());
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (String(process.env.ADMIN_PASSWORD).length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters long.');
  process.exit(1);
}

try {
  await connectDB();
  const email = String(process.env.ADMIN_EMAIL).trim().toLowerCase();
  if (await UserModel.exists({ email })) {
    throw new Error('An account with ADMIN_EMAIL already exists. This script will not promote or overwrite an existing account.');
  }
  const admin = await UserModel.create({
    name: String(process.env.ADMIN_NAME).trim(),
    email,
    password: await hashPassword(String(process.env.ADMIN_PASSWORD)),
    phone: String(process.env.ADMIN_PHONE).trim(),
    role: 'admin',
    referralCode: generateReferralCode(),
    membershipStatus: 'pending',
    tokenVersion: 0,
    isEmailVerified: true,
    mfaEnabled: false,
  });
  console.log(`Administrator created: ${admin.email}. On first production login, complete MFA setup.`);
} catch (error) {
  console.error(`Administrator provisioning failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
