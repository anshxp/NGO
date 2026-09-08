import mongoose, { Schema } from 'mongoose';

const donateSchema = new Schema({
  donator: { type: String, required: true }, donatorEmail: { type: String, required: true }, contact: { type: Number, required: true }, address: { type: String },
  transactionId: { type: String, required: true, unique: true }, amount: { type: Number, required: true, min: 1 },
  payment_method: { type: String, required: true, enum: ['razorpay', 'phonepe', 'payumoney', 'cash', 'bank_transfer', 'upi'] }, timestamp: { type: Date, default: Date.now },
  donation_type: { type: String, required: true, enum: ['one-time', 'monthly', 'campaign', 'general'] },
  payment_status: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'PENDING' }, isAnonymous: { type: Boolean, default: false },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, receiptUrl: { type: String }, orderId: { type: String, index: true }, paymentId: { type: String, index: true }, signature: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const DonateModel = mongoose.model('Donate', donateSchema);
