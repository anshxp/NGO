import { Router } from 'express';
import crypto from 'crypto';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { UserModel } from '../schema/user.js';
import { DonateModel } from '../schema/donate.js';
import { CampaignModel } from '../schema/campaign.js';
import { BeneficiaryModel } from '../schema/beneficiary.js';
import { MessageModel } from '../schema/message.js';
import { EnquiryModel } from '../schema/enquiry.js';
import { NewsModel } from '../schema/news.js';

const router = Router();
router.use(authMiddleware, adminMiddleware);
const validId = (id) => /^[a-f\d]{24}$/i.test(String(id || ''));
const safeText = (value, max = 10000) => typeof value === 'string' ? value.trim().slice(0, max) : '';

router.get('/dashboard/stats', async (_req, res) => {
  const [totalMembers, totalDonations, activeCampaigns, totalBeneficiaries, monthly] = await Promise.all([
    UserModel.countDocuments(),
    DonateModel.aggregate([{ $match: { payment_status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    CampaignModel.countDocuments({ status: 'active' }),
    BeneficiaryModel.countDocuments(),
    DonateModel.aggregate([
      { $match: { payment_status: 'SUCCESS', created_at: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) } } },
      { $group: { _id: { year: { $year: '$created_at' }, month: { $month: '$created_at' } }, donations: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ]);
  const byMonth = new Map(monthly.map((item) => [`${item._id.year}-${item._id.month}`, item.donations]));
  const trend = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() - 11 + index, 1);
    return { month: date.toLocaleString('en', { month: 'short' }), donations: byMonth.get(`${date.getFullYear()}-${date.getMonth() + 1}`) || 0 };
  });
  return res.json({ stats: { totalMembers, totalDonations: totalDonations[0]?.total || 0, activeCampaigns, totalBeneficiaries }, trend });
});

router.get('/beneficiaries', async (_req, res) => res.json(await BeneficiaryModel.find().select('-helpHistory').sort({ created_at: -1 }).limit(500).lean()));
router.get('/beneficiaries/search', async (req, res) => {
  const q = safeText(req.query.q, 100);
  if (!q) return res.json([]);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return res.json(await BeneficiaryModel.find({ $or: [{ name: { $regex: escaped, $options: 'i' } }, { beneficiaryId: { $regex: escaped, $options: 'i' } }] }).select('-helpHistory').limit(100).lean());
});
router.get('/beneficiaries/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const item = await BeneficiaryModel.findById(req.params.id).lean();
  return item ? res.json(item) : res.status(404).json({ error: 'Beneficiary not found' });
});
router.post('/beneficiaries', async (req, res) => {
  const { name, category, address, phone, email, age, gender, notes } = req.body || {};
  if (!safeText(name, 150) || !safeText(category, 100) || !safeText(address, 500)) return res.status(400).json({ error: 'Name, category and address are required' });
  const item = await BeneficiaryModel.create({
    beneficiaryId: `BEN-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    name: safeText(name, 150), category: safeText(category, 100), address: safeText(address, 500),
    phone: safeText(phone, 40) || undefined, email: safeText(email, 254).toLowerCase() || undefined,
    age: age === '' || age == null ? undefined : Number(age), gender: ['male', 'female', 'other'].includes(gender) ? gender : undefined,
    notes: safeText(notes, 2000), status: 'active'
  });
  return res.status(201).json(item);
});
router.put('/beneficiaries/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const allowed = ['name', 'category', 'address', 'phone', 'email', 'age', 'gender', 'notes', 'status'];
  const updates = {};
  for (const key of allowed) if (req.body?.[key] !== undefined) updates[key] = req.body[key];
  for (const key of ['name', 'category', 'address', 'phone', 'email', 'notes']) if (updates[key] !== undefined) updates[key] = safeText(updates[key], key === 'address' ? 500 : key === 'notes' ? 2000 : 254);
  if (updates.email) updates.email = updates.email.toLowerCase();
  const item = await BeneficiaryModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
  return item ? res.json(item) : res.status(404).json({ error: 'Beneficiary not found' });
});

router.get('/messages', async (_req, res) => res.json(await MessageModel.find().sort({ sentDate: -1 }).limit(200).lean()));
router.post('/messages', async (req, res) => {
  const title = safeText(req.body?.title, 200);
  const content = safeText(req.body?.content, 10000);
  const sendToAll = req.body?.sendToAll === true || req.body?.sendToAll === 'true';
  const recipientInput = safeText(req.body?.recipientId, 254);
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  let recipient = null;
  if (!sendToAll) {
    if (!recipientInput) return res.status(400).json({ error: 'Select a recipient or enable send to all' });
    recipient = validId(recipientInput)
      ? await UserModel.findById(recipientInput).select('_id').lean()
      : await UserModel.findOne({ email: recipientInput.toLowerCase() }).select('_id').lean();
    if (!recipient) return res.status(400).json({ error: 'Recipient not found. Enter a valid member email or ID.' });
  }
  const item = await MessageModel.create({
    messageId: `MSG-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    senderId: req.userId, recipientId: recipient?._id, sendToAll, title, content,
    imageUrl: safeText(req.body?.imageUrl, 1000) || undefined,
    sentDate: new Date(), readBy: [], status: 'sent'
  });
  return res.status(201).json({ success: true, message: 'Message sent', id: item._id });
});
router.get('/messages/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const item = await MessageModel.findById(req.params.id).lean();
  return item ? res.json(item) : res.status(404).json({ error: 'Message not found' });
});
router.get('/enquiries', async (_req, res) => res.json(await EnquiryModel.find().sort({ created_at: -1 }).limit(200).lean()));

router.post('/news', async (req, res) => {
  const title = safeText(req.body?.title, 200);
  const content = safeText(req.body?.content, 20000);
  const excerpt = safeText(req.body?.excerpt, 500);
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  const slugBase = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'news';
  const slug = `${slugBase}-${crypto.randomBytes(3).toString('hex')}`;
  const item = await NewsModel.create({ title, slug, content, excerpt, imageUrl: safeText(req.body?.imageUrl, 1000) || undefined, authorId: req.userId, status: 'draft' });
  return res.status(201).json(item);
});
router.put('/news/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const updates = {};
  for (const key of ['title', 'content', 'excerpt', 'imageUrl', 'status']) if (req.body?.[key] !== undefined) updates[key] = req.body[key];
  if (updates.title !== undefined) updates.title = safeText(updates.title, 200);
  if (updates.content !== undefined) updates.content = safeText(updates.content, 20000);
  if (updates.excerpt !== undefined) updates.excerpt = safeText(updates.excerpt, 500);
  if (updates.status !== undefined && !['draft', 'published', 'archived'].includes(updates.status)) return res.status(400).json({ error: 'Invalid news status' });
  if (updates.status === 'published') updates.publishedDate = new Date();
  const item = await NewsModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
  return item ? res.json(item) : res.status(404).json({ error: 'News not found' });
});
router.post('/news/:id/publish', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const item = await NewsModel.findByIdAndUpdate(req.params.id, { $set: { status: 'published', publishedDate: new Date() } }, { new: true, runValidators: true });
  return item ? res.json(item) : res.status(404).json({ error: 'News not found' });
});
router.delete('/news/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const item = await NewsModel.findByIdAndDelete(req.params.id);
  return item ? res.json({ success: true }) : res.status(404).json({ error: 'News not found' });
});

export default router;
