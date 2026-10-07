import { Router } from 'express';
import crypto from 'crypto';
import { UserModel } from '../schema/user.js';
import {
  comparePassword,
  generateMembershipId,
  generateReferralCode,
  hashPassword,
  generateToken,
  generatePurposeToken,
  verifyPurposeToken,
  hashOpaqueToken,
  generateOpaqueToken,
} from '../utils/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import { decryptTotpSecret, encryptTotpSecret, generateTotpSecret, verifyTotpCode, buildTotpUri } from '../utils/totp.js';
import { sendEmailVerification, sendPasswordReset } from '../utils/email.js';

const router = Router();
const isProduction = process.env.NODE_ENV === 'production';
const adminMfaRequired = isProduction || process.env.ADMIN_MFA_REQUIRED === 'true';
const configuredSameSite = process.env.COOKIE_SAMESITE?.trim().toLowerCase();
const cookieSameSite = ['strict', 'lax', 'none'].includes(configuredSameSite) ? configuredSameSite : 'strict';
const cookieSecure = isProduction || cookieSameSite === 'none';
const cookieOptions = { httpOnly: true, secure: cookieSecure, sameSite: cookieSameSite, maxAge: 15 * 60 * 1000, path: '/' };
const safeUser = (user) => { const value = user?.toObject ? user.toObject() : { ...user }; if (value) { delete value.password; delete value.mfaSecretEncrypted; delete value.emailVerificationTokenHash; delete value.passwordResetTokenHash; } return value; };
const setCookie = (res, token) => res.cookie('ngo_access_token', token, cookieOptions);
const clearCookie = (res) => res.clearCookie('ngo_access_token', { httpOnly: true, secure: cookieSecure, sameSite: cookieSameSite, path: '/' });
const emailTokenExpiry = () => new Date(Date.now() + 24 * 60 * 60 * 1000);
const resetTokenExpiry = () => new Date(Date.now() + 30 * 60 * 1000);

const getPurposeUser = async (req, purpose) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const { userId } = verifyPurposeToken(header.slice(7).trim(), purpose);
  return UserModel.findById(userId).select('+mfaSecretEncrypted +emailVerificationTokenHash +passwordResetTokenHash');
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = req.body || {};
    if (!name || !email || !password || !phone) return res.status(400).json({ error: 'Name, email, password and phone are required' });
    const normalizedEmail = String(email).trim().toLowerCase();
    if (String(password).length < 12) return res.status(400).json({ error: 'Password must be at least 12 characters long' });
    if (await UserModel.exists({ email: normalizedEmail })) return res.status(409).json({ error: 'Unable to register with those details' });
    let referrer = null;
    if (referralCode) { referrer = await UserModel.findOne({ referralCode: String(referralCode).trim() }); if (!referrer) return res.status(400).json({ error: 'Invalid referral code' }); }
    const verificationToken = generateOpaqueToken();
    const user = await UserModel.create({
      name: String(name).trim(), email: normalizedEmail, password: await hashPassword(String(password)), phone: String(phone).trim(),
      designation, dateOfBirth, address, referralCode: generateReferralCode(), referredBy: referrer?._id, membershipStatus: 'pending',
      tokenVersion: 0, isEmailVerified: false, emailVerificationTokenHash: hashOpaqueToken(verificationToken), emailVerificationExpiresAt: emailTokenExpiry(),
    });
    if (referrer) await UserModel.updateOne({ _id: referrer._id }, { $inc: { totalReferrals: 1 } });
    try { await sendEmailVerification({ ...user.toObject(), verificationToken }); } catch (error) { console.error('Verification email failed', error?.message || 'unknown error'); }
    return res.status(201).json({ user: safeUser(user), emailVerificationRequired: true });
  } catch (_error) { return res.status(500).json({ error: 'Registration failed' }); }
});

router.post('/verify-email', async (req, res) => {
  try {
    const token = String(req.body?.token || '');
    if (!token) return res.status(400).json({ error: 'Verification token is required' });
    const user = await UserModel.findOne({ emailVerificationTokenHash: hashOpaqueToken(token), emailVerificationExpiresAt: { $gt: new Date() } }).select('+emailVerificationTokenHash');
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification token' });
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (_error) { return res.status(400).json({ error: 'Unable to verify email' }); }
});

router.post('/resend-verification', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const generic = { message: 'If an account exists and needs verification, a new verification email has been sent.' };
  try {
    const user = await UserModel.findOne({ email });
    if (!user || user.isEmailVerified) return res.json(generic);
    const token = generateOpaqueToken();
    user.emailVerificationTokenHash = hashOpaqueToken(token);
    user.emailVerificationExpiresAt = emailTokenExpiry();
    await user.save();
    try { await sendEmailVerification({ ...user.toObject(), verificationToken: token }); } catch (error) { console.error('Verification email failed', error?.message || 'unknown error'); }
    return res.json(generic);
  } catch (_error) { return res.json(generic); }
});

router.post('/forgot-password', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const generic = { message: 'If an account exists for that email, a password reset link has been sent.' };
  if (!email) return res.json(generic);
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json(generic);
    const token = generateOpaqueToken();
    user.passwordResetTokenHash = hashOpaqueToken(token);
    user.passwordResetExpiresAt = resetTokenExpiry();
    await user.save();
    try { await sendPasswordReset({ ...user.toObject(), resetToken: token }); } catch (error) { console.error('Password reset email failed', error?.message || 'unknown error'); }
    return res.json(generic);
  } catch (_error) { return res.json(generic); }
});

router.post('/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '');
    const password = String(req.body?.password || '');
    if (!token || password.length < 12) return res.status(400).json({ error: 'A valid token and password of at least 12 characters are required' });
    const user = await UserModel.findOne({ passwordResetTokenHash: hashOpaqueToken(token), passwordResetExpiresAt: { $gt: new Date() } }).select('+passwordResetTokenHash');
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });
    user.password = await hashPassword(password);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    user.tokenVersion += 1;
    await user.save();
    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (_error) { return res.status(400).json({ error: 'Unable to reset password' }); }
});

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const mfaCode = String(req.body?.mfaCode || '').replace(/\s/g, '');
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await UserModel.findOne({ email }).select('+mfaSecretEncrypted');
    if (!user || !(await comparePassword(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isEmailVerified) return res.status(403).json({ error: 'Email verification required', emailVerificationRequired: true });
    if (user.role === 'admin' && adminMfaRequired && !user.mfaEnabled) {
      const setupToken = generatePurposeToken(user._id.toString(), 'mfa-setup', '10m');
      return res.status(403).json({ error: 'Administrator MFA setup is required', mfaSetupRequired: true, setupToken });
    }
    if (user.mfaEnabled) {
      if (!mfaCode) return res.status(401).json({ error: 'Multi-factor authentication code required', mfaRequired: true });
      if (!user.mfaSecretEncrypted || !verifyTotpCode(decryptTotpSecret(user.mfaSecretEncrypted), mfaCode)) return res.status(401).json({ error: 'Invalid multi-factor authentication code', mfaRequired: true });
    }
    user.lastLogin = new Date();
    await user.save();
    setCookie(res, generateToken(user._id.toString(), user.tokenVersion));
    return res.json({ user: safeUser(user) });
  } catch (_error) { return res.status(401).json({ error: 'Authentication failed' }); }
});

router.post('/mfa/setup', async (req, res) => {
  try {
    const user = await getPurposeUser(req, 'mfa-setup');
    if (!user || user.role !== 'admin' || !user.isEmailVerified) return res.status(403).json({ error: 'MFA setup is not available' });
    const secret = generateTotpSecret();
    user.mfaSecretEncrypted = encryptTotpSecret(secret);
    user.mfaEnabled = false;
    await user.save();
    return res.json({ secret, otpauthUrl: buildTotpUri(secret, user.email), message: 'Scan the QR code or enter the secret into an authenticator app, then confirm with a code.' });
  } catch (_error) { return res.status(401).json({ error: 'Invalid or expired MFA setup token' }); }
});

router.post('/mfa/confirm', async (req, res) => {
  try {
    const user = await getPurposeUser(req, 'mfa-setup');
    if (!user || user.role !== 'admin' || !user.mfaSecretEncrypted) return res.status(403).json({ error: 'MFA setup is not available' });
    if (!verifyTotpCode(decryptTotpSecret(user.mfaSecretEncrypted), req.body?.code)) return res.status(400).json({ error: 'Invalid authenticator code' });
    user.mfaEnabled = true;
    await user.save();
    setCookie(res, generateToken(user._id.toString(), user.tokenVersion));
    return res.json({ success: true, user: safeUser(user) });
  } catch (_error) { return res.status(400).json({ error: 'Unable to confirm MFA' }); }
});

router.post('/logout', authMiddleware, async (req, res) => {
  if (req.userId) await UserModel.updateOne({ _id: req.userId }, { $inc: { tokenVersion: 1 } });
  clearCookie(res);
  return res.json({ success: true });
});

router.get('/me', authMiddleware, (req, res) => res.json({ user: safeUser(req.user) }));

export default router;
