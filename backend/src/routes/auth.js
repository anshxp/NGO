import { Router } from 'express';
import { UserModel } from '../schema/user.js';
import { comparePassword, generateMembershipId, generateReferralCode, hashPassword, generateToken } from '../utils/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const safeUser = (user) => { const value = user?.toObject ? user.toObject() : { ...user }; if (value) delete value.password; return value; };
const setCookie = (res, token) => res.cookie('ngo_access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 15 * 60 * 1000, path: '/' });
const clearCookie = (res) => res.clearCookie('ngo_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', path: '/' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = req.body || {};
    if (!name || !email || !password || !phone) return res.status(400).json({ error: 'Name, email, password and phone are required' });
    const normalizedEmail = String(email).trim().toLowerCase();
    if (String(password).length < 12) return res.status(400).json({ error: 'Password must be at least 12 characters long' });
    if (await UserModel.exists({ email: normalizedEmail })) return res.status(409).json({ error: 'Unable to register with those details' });
    let referrer = null;
    if (referralCode) { referrer = await UserModel.findOne({ referralCode: String(referralCode).trim() }); if (!referrer) return res.status(400).json({ error: 'Invalid referral code' }); }
    const user = await UserModel.create({ name: String(name).trim(), email: normalizedEmail, password: await hashPassword(String(password)), phone: String(phone).trim(), designation, dateOfBirth, address, referralCode: generateReferralCode(), referredBy: referrer?._id, membershipStatus: 'pending', tokenVersion: 0 });
    if (referrer) await UserModel.updateOne({ _id: referrer._id }, { $inc: { totalReferrals: 1 } });
    setCookie(res, generateToken(user._id.toString(), user.tokenVersion));
    return res.status(201).json({ user: safeUser(user) });
  } catch (_error) { return res.status(500).json({ error: 'Registration failed' }); }
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await UserModel.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  user.lastLogin = new Date();
  await user.save();
  setCookie(res, generateToken(user._id.toString(), user.tokenVersion));
  return res.json({ user: safeUser(user) });
});

router.post('/logout', authMiddleware, async (req, res) => {
  if (req.userId) await UserModel.updateOne({ _id: req.userId }, { $inc: { tokenVersion: 1 } });
  clearCookie(res);
  return res.json({ success: true });
});

router.get('/me', authMiddleware, (req, res) => res.json({ user: safeUser(req.user) }));

export default router;
