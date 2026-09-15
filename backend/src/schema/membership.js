import mongoose, { Schema } from 'mongoose';

const membershipSchema = new Schema({
  memberId: { type: String, unique: true, required: true }, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, designationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true },
  membershipStatus: { type: String, enum: ['active', 'inactive', 'suspended', 'expired'], default: 'active' }, joiningDate: { type: Date, default: Date.now }, expiryDate: { type: Date }, membershipFee: { type: Number, required: true },
  receiptUrl: { type: String }, idCardUrl: { type: String }, appointmentLetterUrl: { type: String }, qrCode: { type: String }, renewalDate: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const MembershipModel = mongoose.model('Membership', membershipSchema);
