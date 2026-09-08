import mongoose, { Schema } from 'mongoose';

const receiptSchema = new Schema({
  receiptId: { type: String, unique: true, required: true }, receiptType: { type: String, enum: ['membership', 'donation', 'event', 'cash_donation'], required: true }, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, referenceId: { type: String, required: true }, amount: { type: Number, required: true }, paymentMethod: { type: String, required: true }, transactionId: { type: String }, date: { type: Date, default: Date.now }, pdfUrl: { type: String }, qrCode: { type: String }, status: { type: String, enum: ['issued', 'voided'], default: 'issued' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const ReceiptModel = mongoose.model('Receipt', receiptSchema);
