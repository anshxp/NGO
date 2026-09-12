import { Router } from 'express';
import { ActivityModel } from '../schema/activity.js';
import { MembershipModel } from '../schema/membership.js';
import { ProjectModel } from '../schema/project.js';
import { UserModel } from '../schema/user.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const idOk = (id) => /^[a-f\d]{24}$/i.test(id);

router.post('/activities/:id/like', authMiddleware, async (req, res) => {
  if (!idOk(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const activity = await ActivityModel.findById(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  const alreadyLiked = activity.likes.some((id) => id.toString() === req.userId);
  const update = alreadyLiked ? { $pull: { likes: req.userId } } : { $addToSet: { likes: req.userId } };
  const updated = await ActivityModel.findByIdAndUpdate(req.params.id, update, { new: true });
  return res.json({ liked: !alreadyLiked, likes: updated?.likes?.length || 0 });
});

router.post('/activities/:id/comment', authMiddleware, async (req, res) => {
  if (!idOk(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const comment = String(req.body?.comment || '').trim();
  if (!comment || comment.length > 1000) return res.status(400).json({ error: 'Comment must be between 1 and 1000 characters' });
  const activity = await ActivityModel.findByIdAndUpdate(req.params.id, { $push: { comments: { userId: req.userId, comment, createdAt: new Date() } } }, { new: true });
  return activity ? res.status(201).json({ success: true, comment: activity.comments.at(-1) }) : res.status(404).json({ error: 'Activity not found' });
});

router.get('/projects/:id/reports', async (req, res) => {
  if (!idOk(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const project = await ProjectModel.findById(req.params.id).select('reports');
  return project ? res.json({ reports: project.reports || [] }) : res.status(404).json({ error: 'Project not found' });
});

router.post('/memberships/:id/renew', authMiddleware, async (req, res) => {
  if (!idOk(req.params.id)) return res.status(400).json({ error: 'Invalid identifier' });
  const membership = await MembershipModel.findById(req.params.id);
  if (!membership) return res.status(404).json({ error: 'Membership not found' });
  if (req.user?.role !== 'admin' && membership.userId.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });
  const months = Number(req.body?.durationMonths ?? 12);
  if (!Number.isInteger(months) || months < 1 || months > 36) return res.status(400).json({ error: 'durationMonths must be an integer between 1 and 36' });
  const base = membership.expiryDate && new Date(membership.expiryDate) > new Date() ? new Date(membership.expiryDate) : new Date();
  const expiryDate = new Date(base);
  expiryDate.setMonth(expiryDate.getMonth() + months);
  membership.expiryDate = expiryDate;
  membership.renewalDate = new Date();
  membership.membershipStatus = 'active';
  await membership.save();
  await UserModel.updateOne({ _id: membership.userId }, { $set: { membershipStatus: 'active', membershipPaidDate: new Date() } });
  return res.json({ success: true, message: 'Membership renewed', expiryDate: membership.expiryDate });
});

export default router;
