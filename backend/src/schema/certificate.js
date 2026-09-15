import mongoose, { Schema } from 'mongoose';

const certificateSchema = new Schema({
  certificateId: { type: String, unique: true, required: true }, recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientType: { type: String, enum: ['member', 'visitor'], required: true }, recipientName: { type: String, required: true }, recipientEmail: { type: String, required: true },
  title: { type: String, required: true }, description: { type: String }, issueDate: { type: Date, default: Date.now }, certificateUrl: { type: String }, pdfUrl: { type: String }, qrCode: { type: String },
  verificationCode: { type: String, unique: true, required: true }, isVerified: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const CertificateModel = mongoose.model('Certificate', certificateSchema);
