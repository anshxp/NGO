import { Router } from 'express';
import { UserModel } from '../schema/user.js';
import { DonateModel } from '../schema/donate.js';
import { ProjectModel } from '../schema/project.js';
import { BeneficiaryModel } from '../schema/beneficiary.js';
import { ExpenseModel } from '../schema/expense.js';
import { CampaignModel } from '../schema/campaign.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware, adminMiddleware);

const csv = (rows) => {
  if (!rows.length) return 'No data\n';
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n') + '\n';
};

router.get('/:reportType', async (req, res) => {
  const type = req.params.reportType;
  let rows = [];
  switch (type) {
    case 'membership': rows = (await UserModel.find().select('name email phone membershipId membershipStatus membershipFee membershipPaidDate created_at').lean()).map((u) => ({ name: u.name, email: u.email, phone: u.phone, membershipId: u.membershipId, membershipStatus: u.membershipStatus, membershipFee: u.membershipFee, membershipPaidDate: u.membershipPaidDate, createdAt: u.created_at })); break;
    case 'donations': rows = (await DonateModel.find().select('-signature').sort({ created_at: -1 }).lean()).map((d) => ({ transactionId: d.transactionId, donor: d.donator, email: d.donatorEmail, amount: d.amount, method: d.payment_method, status: d.payment_status, type: d.donation_type, date: d.created_at })); break;
    case 'projects': rows = (await ProjectModel.find().lean()).map((p) => ({ projectId: p.projectId, title: p.title, budget: p.totalBudget, fundsReceived: p.fundsReceived, expenses: p.expenses, status: p.status, startDate: p.startDate, endDate: p.endDate })); break;
    case 'beneficiaries': rows = (await BeneficiaryModel.find().select('-helpHistory').lean()).map((b) => ({ beneficiaryId: b.beneficiaryId, name: b.name, email: b.email, phone: b.phone, category: b.category, status: b.status, createdAt: b.created_at })); break;
    case 'expenses': rows = (await ExpenseModel.find().sort({ date: -1 }).lean()).map((e) => ({ expenseId: e.expenseId, projectId: e.projectId, amount: e.amount, category: e.category, description: e.description, status: e.status, date: e.date })); break;
    case 'campaigns': rows = (await CampaignModel.find().lean()).map((c) => ({ id: c._id, title: c.title, goal: c.goal, raised: c.raised, donationCount: c.donationCount, status: c.status, startDate: c.startDate, endDate: c.endDate })); break;
    case 'income-expense': { const [income] = await DonateModel.aggregate([{ $match: { payment_status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]); const [expense] = await ExpenseModel.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]); rows = [{ income: income?.total || 0, expenses: expense?.total || 0, balance: (income?.total || 0) - (expense?.total || 0), generatedAt: new Date().toISOString() }]; break; }
    default: return res.status(400).json({ error: 'Invalid report type' });
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="ngo-${type}-report.csv"`);
  return res.send(csv(rows));
});

export default router;
