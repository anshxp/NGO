import { DonateModel } from '../../schema/donate';
import { UserModel } from '../../schema/user';
import { sendDonationReceipt } from '../../utils/email';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { generateDonationPDF } from '../../utils/pdf';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

export const donateResolvers = {
    Query: {
        getDonations: async (_: any, { limit = 10, offset = 0 }: any) => {
            return await DonateModel.find().limit(limit).skip(offset).populate('referredBy');
        },
        getDonation: async (_: any, { id }: any) => {
            return await DonateModel.findById(id).populate('referredBy');
        },
        getDonationsByStatus: async (_: any, { status }: any) => {
            return await DonateModel.find({ payment_status: status }).populate('referredBy');
        },
        getDonationStats: async () => {
            const allDonations = await DonateModel.find();
            const successfulDonations = allDonations.filter(d => d.payment_status === 'SUCCESS');
            const failedDonations = allDonations.filter(d => d.payment_status === 'FAILED');
            const pendingDonations = allDonations.filter(d => d.payment_status === 'PENDING');

            const totalAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
            const pendingAmount = pendingDonations.reduce((sum, d) => sum + d.amount, 0);

            return {
                totalDonations: allDonations.length,
                totalAmount,
                pendingAmount,
                successfulDonations: successfulDonations.length,
                failedDonations: failedDonations.length
            };
        },
        getUserDonations: async (_: any, { userId }: any) => {
            return await DonateModel.find({ referredBy: userId });
        }
    },
    Mutation: {
        createDonation: async (_: any, { input }: any) => {
            const { donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode } = input;

            // Find referrer if referral code provided
            let referrer = null;
            if (referralCode) {
                referrer = await UserModel.findOne({ referralCode });
            }

            // Generate transaction ID
            const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

            const donation = new DonateModel({
                donator,
                donatorEmail,
                contact,
                address,
                transactionId,
                amount,
                payment_method,
                donation_type,
                isAnonymous: isAnonymous || false,
                referredBy: referrer?._id,
                payment_status: 'PENDING'
            });

            await donation.save();

            // Send donation receipt email
            try {
                await sendDonationReceipt(donation);
            } catch (emailError) {
                console.error('Failed to send donation receipt:', emailError);
            }

            // Update referrer's donation stats
            if (referrer) {
                referrer.totalDonationsReferred += amount;
                await referrer.save();
            }

            // Send receipt email for cash donation
            try {
                await sendDonationReceipt(donation);
            } catch (emailError) {
                console.error('Failed to send cash donation receipt:', emailError);
            }

            return donation;
        },
        createDonationOrder: async (_: any, { input }: any) => {
            const { donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode } = input;

            if (payment_method !== 'razorpay') {
                throw new Error('payment_method must be razorpay for order creation');
            }

            let referrer = null;
            if (referralCode) {
                referrer = await UserModel.findOne({ referralCode });
            }

            // Create Razorpay order (amount in paise)
            const order = await razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency: 'INR',
                receipt: `rcpt_${Date.now()}`,
                notes: {
                    donator,
                    donation_type
                }
            });

            const transactionId = `ORD${Date.now()}${Math.random().toString(36).substring(2,7).toUpperCase()}`;

            const donation = new DonateModel({
                donator,
                donatorEmail,
                contact,
                address,
                transactionId,
                amount,
                payment_method,
                donation_type,
                isAnonymous: isAnonymous || false,
                referredBy: referrer?._id,
                payment_status: 'PENDING',
                orderId: order.id
            });

            await donation.save();
            return donation;
        },
        verifyDonationPayment: async (_: any, { orderId, paymentId, signature }: any) => {
            const donation = await DonateModel.findOne({ orderId });
            if (!donation) throw new Error('Donation order not found');

            // Verify signature
            const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
                .update(orderId + '|' + paymentId)
                .digest('hex');

            if (expected !== signature) {
                donation.payment_status = 'FAILED';
                await donation.save();
                throw new Error('Invalid payment signature');
            }

            donation.payment_status = 'SUCCESS';
            donation.paymentId = paymentId;
            donation.signature = signature;

            // Generate PDF receipt
            try {
                const pdfPath = await generateDonationPDF(donation as any);
                donation.receiptUrl = pdfPath;
            } catch (pdfErr) {
                console.error('PDF generation failed', pdfErr);
            }

            await donation.save();

            // Send email with receipt
            try {
                await sendDonationReceipt(donation);
            } catch (e) {
                console.error('Email send failed after verification', e);
            }

            return donation;
        },
        updateDonationStatus: async (_: any, { id, status }: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const donation = await DonateModel.findById(id);
            if (!donation) {
                throw new Error('Donation not found');
            }

            donation.payment_status = status;
            await donation.save();

            return donation;
        },
        createCashDonation: async (_: any, { input }: any, context: any) => {
            if (!context.userId || context.user.role !== 'admin') {
                throw new Error('Unauthorized - Admin only');
            }

            const { donator, donatorEmail, contact, address, amount, donation_type, isAnonymous, referralCode } = input;

            let referrer = null;
            if (referralCode) {
                referrer = await UserModel.findOne({ referralCode });
            }

            const transactionId = `CASH${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

            const donation = new DonateModel({
                donator,
                donatorEmail,
                contact,
                address,
                transactionId,
                amount,
                payment_method: 'cash',
                donation_type,
                isAnonymous: isAnonymous || false,
                referredBy: referrer?._id,
                payment_status: 'SUCCESS'
            });

            await donation.save();

            if (referrer) {
                referrer.totalDonationsReferred += amount;
                await referrer.save();
            }

            return donation;
        }
    }
};
