import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { UserModel } from '../schema/user';
import { DonateModel } from '../schema/donate';
import { MembershipModel } from '../schema/membership';
import { CertificateModel } from '../schema/certificate';
import { NewsModel } from '../schema/news';
import { ActivityModel } from '../schema/activity';
import { CampaignModel } from '../schema/campaign';
import { ProjectModel } from '../schema/project';
import { BeneficiaryModel } from '../schema/beneficiary';
import { ExpenseModel } from '../schema/expense';
import { EventModel } from '../schema/event';
import { EventRegistrationModel } from '../schema/eventRegistration';
import { InternshipModel } from '../schema/internship';
import { EnquiryModel } from '../schema/enquiry';
import { MessageModel } from '../schema/message';
import { ReceiptModel } from '../schema/receipt';
import { VolunteerModel } from '../schema/volunteer';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';
import { comparePassword, generateMembershipId, generateReferralCode, hashPassword, generateToken } from '../utils/auth';
import { sendDonationReceipt } from '../utils/email';
import { generateDonationPDF } from '../utils/pdf';

const router = Router();
const publicRouter = Router();
const protectedRouter = Router();
const adminRouter = Router();

const safeUser = (user: any) => {
    if (!user) return null;
    const value = user.toObject ? user.toObject() : user;
    delete value.password;
    return value;
};

const setAuthCookie = (res: Response, token: string) => {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('ngo_access_token', token, {
        httpOnly: true,
        secure,
        sameSite: secure ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/'
    });
};

const parseLimit = (value: unknown, fallback = 20, max = 100) => {
    const n = Number(value ?? fallback);
    return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 1), max) : fallback;
};

const parseOffset = (value: unknown) => {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? Math.max(Math.floor(n), 0) : 0;
};

const requireObjectId = (id: string) => {
    if (!/^[a-f\d]{24}$/i.test(id)) throw Object.assign(new Error('Invalid identifier'), { status: 400 });
};

// Authentication
publicRouter.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, designation, dateOfBirth, address, referralCode } = req.body || {};
        if (!name || !email || !password || !phone) return res.status(400).json({ error: 'Name, email, password and phone are required' });
        const normalizedEmail = String(email).trim().toLowerCase();
        if (String(password).length < 12) return res.status(400).json({ error: 'Password must be at least 12 characters long' });
        if (await UserModel.exists({ email: normalizedEmail })) return res.status(409).json({ error: 'Unable to register with those details' });
        let referrer: any = null;
        if (referralCode) {
            referrer = await UserModel.findOne({ referralCode: String(referralCode).trim() });
            if (!referrer) return res.status(400).json({ error: 'Invalid referral code' });
        }
        const user = await UserModel.create({
            name: String(name).trim(), email: normalizedEmail, password: await hashPassword(String(password)),
            phone: String(phone).trim(), designation, dateOfBirth, address,
            referralCode: generateReferralCode(), referredBy: referrer?._id, membershipStatus: 'pending'
        });
        if (referrer) await UserModel.updateOne({ _id: referrer._id }, { $inc: { totalReferrals: 1 } });
        setAuthCookie(res, generateToken(user._id.toString()));
        return res.status(201).json({ user: safeUser(user) });
    } catch (error: any) {
        return res.status(error?.status || 500).json({ error: error?.status ? error.message : 'Registration failed' });
    }
});

publicRouter.post('/auth/login', async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const password = String(req.body?.password || '');
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
        const user = await UserModel.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
        user.lastLogin = new Date();
        await user.save();
        setAuthCookie(res, generateToken(user._id.toString()));
        return res.json({ user: safeUser(user) });
    } catch (_error) { return res.status(401).json({ error: 'Invalid credentials' }); }
});

publicRouter.post('/auth/logout', (_req, res) => {
    res.clearCookie('ngo_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', path: '/' });
    return res.json({ success: true });
});

publicRouter.get('/auth/me', authMiddleware, (req: AuthRequest, res) => res.json({ user: safeUser(req.user) }));

// Public content
publicRouter.get('/news', async (_req, res) => res.json(await NewsModel.find({ status: 'published' }).sort({ publishedDate: -1, created_at: -1 }).limit(100)));
publicRouter.get('/news/:slug', async (req, res) => {
    const news: any = await NewsModel.findOne({ slug: req.params.slug, status: 'published' });
    if (!news) return res.status(404).json({ error: 'News not found' });
    await NewsModel.updateOne({ _id: news._id }, { $inc: { views: 1 } });
    return res.json(news);
});
publicRouter.get('/activities', async (_req, res) => res.json(await ActivityModel.find({ status: 'published' }).sort({ created_at: -1 }).limit(100)));
publicRouter.get('/activities/:id', async (req, res) => {
    try { requireObjectId(req.params.id); const item = await ActivityModel.findById(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Activity not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
publicRouter.get('/campaigns', async (_req, res) => res.json(await CampaignModel.find({ status: { $ne: 'cancelled' } }).sort({ startDate: -1 }).limit(100)));
publicRouter.get('/campaigns/active', async (_req, res) => res.json(await CampaignModel.find({ status: 'active', endDate: { $gte: new Date() } }).sort({ endDate: 1 })));
publicRouter.get('/campaigns/:id', async (req, res) => {
    try { requireObjectId(req.params.id); const item = await CampaignModel.findById(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Campaign not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
publicRouter.get('/projects', async (_req, res) => res.json(await ProjectModel.find().select('-beneficiaries').sort({ startDate: -1 }).limit(100)));
publicRouter.get('/projects/:id', async (req, res) => {
    try { requireObjectId(req.params.id); const item = await ProjectModel.findById(req.params.id).select('-beneficiaries'); return item ? res.json(item) : res.status(404).json({ error: 'Project not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
publicRouter.get('/events', async (_req, res) => res.json(await EventModel.find({ status: { $ne: 'cancelled' } }).sort({ eventDate: 1 }).limit(100)));
publicRouter.get('/events/upcoming', async (_req, res) => res.json(await EventModel.find({ status: { $ne: 'cancelled' }, eventDate: { $gte: new Date() } }).sort({ eventDate: 1 }).limit(100)));
publicRouter.get('/events/:id', async (req, res) => {
    try { requireObjectId(req.params.id); const item = await EventModel.findById(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Event not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
publicRouter.get('/internships', async (_req, res) => res.json(await InternshipModel.find({ status: { $ne: 'closed' } }).sort({ startDate: 1 }).limit(100)));
publicRouter.get('/internships/:id', async (req, res) => {
    try { requireObjectId(req.params.id); const item = await InternshipModel.findById(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Internship not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
publicRouter.get('/certificates/verify/:code', async (req, res) => {
    const item = await CertificateModel.findOne({ verificationCode: req.params.code });
    return item ? res.json(item) : res.status(404).json({ error: 'Certificate not found' });
});

// Donations and enquiries
publicRouter.post('/donations', async (req, res) => {
    try {
        const { donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode } = req.body || {};
        const numericAmount = Number(amount);
        if (!donator || !donatorEmail || !contact || !Number.isFinite(numericAmount) || numericAmount < 1 || !payment_method || !donation_type) return res.status(400).json({ error: 'Invalid donation data' });
        let referrer: any = null;
        if (referralCode) referrer = await UserModel.findOne({ referralCode: String(referralCode).trim() });
        const transactionId = `TXN${Date.now()}${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
        const donation = await DonateModel.create({ donator: String(donator).trim(), donatorEmail: String(donatorEmail).trim().toLowerCase(), contact, address, transactionId, amount: numericAmount, payment_method, donation_type, isAnonymous: Boolean(isAnonymous), referredBy: referrer?._id, payment_status: payment_method === 'cash' ? 'PENDING' : 'PENDING' });
        return res.status(201).json(donation);
    } catch (_error) { return res.status(500).json({ error: 'Unable to create donation' }); }
});

publicRouter.post('/donations/order', async (req, res) => {
    try {
        if (req.body?.payment_method !== 'razorpay') return res.status(400).json({ error: 'Only Razorpay is supported for online orders' });
        const amount = Number(req.body?.amount);
        if (!Number.isFinite(amount) || amount < 1) return res.status(400).json({ error: 'Invalid amount' });
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'Online payments are temporarily unavailable' });
        const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const receipt = `rcpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt });
        const donation = await DonateModel.create({ ...req.body, amount, transactionId: `ORD${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`, payment_status: 'PENDING', orderId: order.id });
        return res.status(201).json({ donation, order: { id: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID } });
    } catch (_error) { return res.status(500).json({ error: 'Unable to create payment order' }); }
});

publicRouter.post('/donations/verify', async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body || {};
        const donation = await DonateModel.findOne({ orderId });
        if (!donation || !process.env.RAZORPAY_KEY_SECRET) return res.status(400).json({ error: 'Invalid payment' });
        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature || '')))) return res.status(400).json({ error: 'Payment verification failed' });
        if (donation.payment_status === 'SUCCESS') return res.json(donation);
        donation.payment_status = 'SUCCESS'; donation.paymentId = paymentId; donation.signature = signature;
        try { donation.receiptUrl = await generateDonationPDF(donation as any); } catch (_e) { /* receipt generation can be retried */ }
        await donation.save();
        try { await sendDonationReceipt(donation); } catch (_e) { /* email failure must not invalidate payment */ }
        return res.json(donation);
    } catch (_error) { return res.status(500).json({ error: 'Payment verification failed' }); }
});

publicRouter.post('/enquiries', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body || {};
        if (!name || !email || !subject || !message) return res.status(400).json({ error: 'Name, email, subject and message are required' });
        const enquiry = await EnquiryModel.create({ name, email: String(email).trim().toLowerCase(), phone: phone || '', subject, message, status: 'new' });
        return res.status(201).json({ success: true, message: 'Enquiry submitted successfully', id: enquiry._id });
    } catch (_error) { return res.status(500).json({ error: 'Unable to submit enquiry' }); }
});

// Authenticated user operations
protectedRouter.get('/users/:id', async (req: AuthRequest, res) => {
    try { requireObjectId(req.params.id); if (req.user?.role !== 'admin' && req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' }); const user = await UserModel.findById(req.params.id).select('-password').populate('designation'); return user ? res.json(user) : res.status(404).json({ error: 'User not found' }); }
    catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); }
});
protectedRouter.get('/donations/user/history', async (req: AuthRequest, res) => res.json(await DonateModel.find({ $or: [{ donatorEmail: req.user?.email }, { referredBy: req.userId }] }).sort({ created_at: -1 }).limit(100)));
protectedRouter.get('/memberships/:id', async (req: AuthRequest, res) => { try { requireObjectId(req.params.id); const item = await MembershipModel.findById(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Membership not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
protectedRouter.post('/events/:id/register', async (req: AuthRequest, res) => {
    try { requireObjectId(req.params.id); const event: any = await EventModel.findById(req.params.id); if (!event) return res.status(404).json({ error: 'Event not found' }); const exists = await EventRegistrationModel.exists({ eventId: event._id, userId: req.userId }); if (exists) return res.status(409).json({ error: 'Already registered' }); const registration = await EventRegistrationModel.create({ eventId: event._id, userId: req.userId }); await EventModel.updateOne({ _id: event._id }, { $inc: { registrationCount: 1 }, $addToSet: { registrations: req.userId } }); return res.status(201).json({ success: true, registration }); }
    catch (e: any) { return res.status(e.status || 500).json({ error: e.message || 'Registration failed' }); }
});
protectedRouter.post('/internships/:id/apply', async (req: AuthRequest, res) => {
    try { requireObjectId(req.params.id); const internship: any = await InternshipModel.findById(req.params.id); if (!internship) return res.status(404).json({ error: 'Internship not found' }); if ((internship.applicants || []).some((id: any) => id.toString() === req.userId)) return res.status(409).json({ error: 'Already applied' }); await InternshipModel.updateOne({ _id: internship._id }, { $addToSet: { applicants: req.userId } }); return res.json({ success: true, message: 'Application submitted' }); }
    catch (e: any) { return res.status(e.status || 500).json({ error: e.message || 'Application failed' }); }
});

// Admin operations
adminRouter.get('/users', async (req, res) => res.json(await UserModel.find().select('-password').limit(parseLimit(req.query.limit)).skip(parseOffset(req.query.offset)).populate('designation')));
adminRouter.get('/donations', async (req, res) => res.json(await DonateModel.find().select('-signature').limit(parseLimit(req.query.limit)).skip(parseOffset(req.query.offset)).sort({ created_at: -1 })));
adminRouter.get('/donations/:id', async (req, res) => { try { requireObjectId(req.params.id); const d = await DonateModel.findById(req.params.id).select('-signature'); return d ? res.json(d) : res.status(404).json({ error: 'Donation not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.get('/donations/stats', async (_req, res) => { const [summary] = await DonateModel.aggregate([{ $group: { _id: '$payment_status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]); const rows = await DonateModel.aggregate([{ $group: { _id: '$payment_status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]); const get = (s: string) => rows.find((r: any) => r._id === s) || { count: 0, amount: 0 }; return res.json({ totalDonations: rows.reduce((n: number, r: any) => n + r.count, 0), totalAmount: get('SUCCESS').amount, pendingAmount: get('PENDING').amount, successfulDonations: get('SUCCESS').count, failedDonations: get('FAILED').count }); });
adminRouter.get('/beneficiaries', async (req, res) => res.json(await BeneficiaryModel.find().sort({ created_at: -1 }).limit(parseLimit(req.query.limit))));
adminRouter.get('/beneficiaries/:id', async (req, res) => { try { requireObjectId(req.params.id); const b = await BeneficiaryModel.findById(req.params.id); return b ? res.json(b) : res.status(404).json({ error: 'Beneficiary not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.get('/beneficiaries/search', async (req, res) => { const q = String(req.query.q || '').trim().slice(0, 100); if (!q) return res.json([]); const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return res.json(await BeneficiaryModel.find({ $or: [{ name: { $regex: escaped, $options: 'i' } }, { beneficiaryId: { $regex: escaped, $options: 'i' } }, { category: { $regex: escaped, $options: 'i' } }] }).limit(50)); });
adminRouter.get('/enquiries', async (_req, res) => res.json(await EnquiryModel.find().sort({ created_at: -1 }).limit(200)));
adminRouter.get('/messages', async (_req, res) => res.json(await MessageModel.find().sort({ sentDate: -1 }).limit(200)));
adminRouter.get('/volunteers', async (_req, res) => res.json(await VolunteerModel.find().select('-emergencyContact').sort({ created_at: -1 }).limit(200)));
adminRouter.get('/certificates', async (_req, res) => res.json(await CertificateModel.find().sort({ issueDate: -1 }).limit(200)));
adminRouter.get('/receipts', async (_req, res) => res.json(await ReceiptModel.find().sort({ date: -1 }).limit(200)));
adminRouter.get('/dashboard/stats', async (_req, res) => { const [users, donations, projects, beneficiaries] = await Promise.all([UserModel.countDocuments(), DonateModel.countDocuments({ payment_status: 'SUCCESS' }), ProjectModel.countDocuments(), BeneficiaryModel.countDocuments()]); const [money] = await DonateModel.aggregate([{ $match: { payment_status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]); return res.json({ stats: { users, donations, projects, beneficiaries, totalDonations: money?.total || 0 } }); });

adminRouter.post('/users/:id/membership-status', async (req: AuthRequest, res) => { try { requireObjectId(req.params.id); const status = String(req.body?.status || ''); if (!['active', 'inactive', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid membership status' }); const user: any = await UserModel.findById(req.params.id); if (!user) return res.status(404).json({ error: 'User not found' }); user.membershipStatus = status as any; if (status === 'active' && !user.membershipId) user.membershipId = generateMembershipId(user._id.toString()); await user.save(); return res.json({ user: safeUser(user) }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/news', async (req: AuthRequest, res) => { const { title, content, excerpt, imageUrl } = req.body || {}; if (!title || !content) return res.status(400).json({ error: 'Title and content are required' }); const slug = String(title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(3).toString('hex'); const item = await NewsModel.create({ title, content, excerpt, imageUrl, slug, authorId: req.userId, status: 'draft' }); return res.status(201).json(item); });
adminRouter.put('/news/:id', async (req, res) => { try { requireObjectId(req.params.id); const item = await NewsModel.findByIdAndUpdate(req.params.id, { $set: { title: req.body.title, content: req.body.content, excerpt: req.body.excerpt, imageUrl: req.body.imageUrl, ...(req.body.status ? { status: req.body.status } : {}) } }, { new: true, runValidators: true }); return item ? res.json(item) : res.status(404).json({ error: 'News not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/news/:id/publish', async (req, res) => { try { requireObjectId(req.params.id); const item = await NewsModel.findByIdAndUpdate(req.params.id, { status: 'published', publishedDate: new Date() }, { new: true }); return item ? res.json(item) : res.status(404).json({ error: 'News not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.delete('/news/:id', async (req, res) => { try { requireObjectId(req.params.id); await NewsModel.findByIdAndUpdate(req.params.id, { status: 'archived' }); return res.json({ success: true }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/projects', async (req: AuthRequest, res) => { const { title, description, objective, totalBudget, endDate, imageUrl } = req.body || {}; if (!title || !description || !Number.isFinite(Number(totalBudget))) return res.status(400).json({ error: 'Invalid project data' }); const project = await ProjectModel.create({ projectId: `PROJ-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`, title, description, objective, totalBudget: Number(totalBudget), startDate: new Date(), endDate, imageUrl, organizer: req.userId, status: 'planning' }); return res.status(201).json(project); });
adminRouter.post('/beneficiaries', async (req, res) => { const { name, email, phone, address, age, gender, category } = req.body || {}; if (!name || !address || !category) return res.status(400).json({ error: 'Name, address and category are required' }); const beneficiary = await BeneficiaryModel.create({ beneficiaryId: `BEN-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`, name, email, phone, address, age, gender, category, status: 'active' }); return res.status(201).json(beneficiary); });
adminRouter.put('/beneficiaries/:id', async (req, res) => { try { requireObjectId(req.params.id); const allowed = ['name', 'email', 'phone', 'address', 'status']; const update: any = {}; for (const key of allowed) if (req.body?.[key] !== undefined) update[key] = req.body[key]; const item = await BeneficiaryModel.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true }); return item ? res.json(item) : res.status(404).json({ error: 'Beneficiary not found' }); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/projects/:projectId/expenses', async (req: AuthRequest, res) => { try { requireObjectId(req.params.projectId); const amount = Number(req.body?.amount); if (!Number.isFinite(amount) || amount <= 0 || !req.body?.category || !req.body?.description) return res.status(400).json({ error: 'Invalid expense' }); const project = await ProjectModel.findById(req.params.projectId); if (!project) return res.status(404).json({ error: 'Project not found' }); const expense = await ExpenseModel.create({ expenseId: `EXP-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`, amount, category: req.body.category, description: req.body.description, projectId: project._id, status: 'pending' }); return res.status(201).json(expense); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/expenses/:id/approve', async (req: AuthRequest, res) => { try { requireObjectId(req.params.id); const expense: any = await ExpenseModel.findById(req.params.id); if (!expense) return res.status(404).json({ error: 'Expense not found' }); if (expense.status === 'approved') return res.json(expense); expense.status = 'approved'; expense.approvedBy = req.userId; await expense.save(); await ProjectModel.updateOne({ _id: expense.projectId }, { $inc: { expenses: expense.amount } }); return res.json(expense); } catch (e: any) { return res.status(e.status || 400).json({ error: e.message }); } });
adminRouter.post('/donations/cash', async (req: AuthRequest, res) => { const amount = Number(req.body?.amount); if (!Number.isFinite(amount) || amount < 1 || !req.body?.donator || !req.body?.donatorEmail || !req.body?.donation_type) return res.status(400).json({ error: 'Invalid cash donation' }); const donation = await DonateModel.create({ ...req.body, amount, payment_method: 'cash', transactionId: `CASH${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`, payment_status: 'SUCCESS' }); return res.status(201).json(donation); });
adminRouter.post('/reports/:reportType', async (req, res) => { const allowed = new Set(['membership', 'donations', 'projects', 'beneficiaries', 'expenses', 'campaigns', 'income-expense']); if (!allowed.has(req.params.reportType)) return res.status(400).json({ error: 'Invalid report type' }); return res.status(501).json({ error: 'Report generation is not yet implemented' }); });

router.use(publicRouter);
router.use(protectedRouter);
router.use(adminRouter);
export const apiRouter = router;
