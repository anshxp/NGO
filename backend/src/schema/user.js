import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  role: { type: String, enum: ['admin', 'member', 'volunteer', 'coordinator'], default: 'member', index: true },
  designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
  dateOfBirth: { type: Date },
  address: { type: String },
  membershipId: { type: String, unique: true, sparse: true },
  membershipStatus: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending', index: true },
  membershipFee: { type: Number },
  membershipPaidDate: { type: Date },
  referralCode: { type: String, unique: true, required: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  totalReferrals: { type: Number, default: 0 },
  totalDonationsReferred: { type: Number, default: 0 },
  idCardUrl: { type: String },
  certificateUrl: { type: String },
  appointmentLetterUrl: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  tokenVersion: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const UserModel = mongoose.model('User', userSchema);
