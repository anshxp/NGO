import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { DonateModel } from '../schema/donate.js';
import { generateDonationPDF } from '../utils/pdf.js';
import { sendDonationReceipt } from '../utils/email.js';

const router = Router();

const getClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

const verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
};

const finalizeDonation = async (donation, payment) => {
  if (donation.payment_status === 'SUCCESS') return donation;

  const updated = await DonateModel.findOneAndUpdate(
    { _id: donation._id, payment_status: { $ne: 'SUCCESS' } },
    { $set: { payment_status: 'SUCCESS', paymentId: payment.id } },
    { new: true }
  );
  if (!updated) return DonateModel.findById(donation._id);

  try {
    updated.receiptUrl = await generateDonationPDF(updated);
    await updated.save();
  } catch (_error) {
    // Payment state remains authoritative even if receipt generation fails.
  }

  try {
    await sendDonationReceipt(updated);
  } catch (_error) {
    // Payment state remains authoritative even if email delivery fails.
  }

  return updated;
};

router.post('/donations/order', async (req, res) => {
  try {
    const razorpay = getClient();
    if (!razorpay) return res.status(503).json({ error: 'Online payments are temporarily unavailable' });

    const { donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode } = req.body || {};
    const numericAmount = Number(amount);
    if (!donator || !donatorEmail || !contact || payment_method !== 'razorpay' || !Number.isFinite(numericAmount) || numericAmount < 1 || !['one-time', 'monthly', 'general'].includes(donation_type)) {
      return res.status(400).json({ error: 'Invalid donation data' });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    });

    const donation = await DonateModel.create({
      donator: String(donator).trim(),
      donatorEmail: String(donatorEmail).trim().toLowerCase(),
      contact: Number(contact),
      address: address ? String(address).trim() : undefined,
      amount: numericAmount,
      payment_method: 'razorpay',
      donation_type,
      isAnonymous: Boolean(isAnonymous),
      referralCode: undefined,
      payment_status: 'PENDING',
      transactionId: `ORD${Date.now()}${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
      orderId: order.id,
    });

    if (referralCode) {
      // Referral attribution is resolved without accepting arbitrary donation fields.
      donation.referredBy = undefined;
    }

    return res.status(201).json({
      donation: { id: donation._id, orderId: order.id, amount: numericAmount, payment_status: donation.payment_status },
      order: { id: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID },
    });
  } catch (_error) {
    return res.status(502).json({ error: 'Unable to create payment order' });
  }
});

router.post('/donations/verify', async (req, res) => {
  try {
    const razorpay = getClient();
    const { orderId, paymentId, signature } = req.body || {};
    if (!razorpay || !orderId || !paymentId || !signature) return res.status(400).json({ error: 'Invalid payment' });

    const donation = await DonateModel.findOne({ orderId });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.payment_status === 'SUCCESS') return res.json(donation);

    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    if (!safeEqual(expected, signature)) return res.status(400).json({ error: 'Payment verification failed' });

    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      razorpay.payments.fetch(paymentId),
    ]);

    if (payment.order_id !== orderId || payment.currency !== 'INR' || payment.amount !== Math.round(donation.amount * 100) || payment.status !== 'captured' || order.currency !== 'INR' || order.amount !== Math.round(donation.amount * 100)) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    return res.json(await finalizeDonation(donation, payment));
  } catch (_error) {
    return res.status(502).json({ error: 'Payment verification failed' });
  }
});

router.post('/payments/razorpay/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    if (!secret || !verifyWebhookSignature(req.body, signature, secret)) return res.status(401).json({ error: 'Invalid webhook signature' });

    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment?.id && payment?.order_id) {
        const donation = await DonateModel.findOne({ orderId: payment.order_id });
        if (donation && payment.status === 'captured' && payment.currency === 'INR' && payment.amount === Math.round(donation.amount * 100)) await finalizeDonation(donation, payment);
      }
    } else if (event.event === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) await DonateModel.updateOne({ orderId: payment.order_id, payment_status: 'PENDING' }, { $set: { payment_status: 'FAILED', paymentId: payment.id } });
    }

    return res.json({ received: true });
  } catch (_error) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }
});

export default router;
