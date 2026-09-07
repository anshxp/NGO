import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string; email: string; password: string; phone: string;
    role: 'admin' | 'member' | 'volunteer' | 'coordinator'; designation?: mongoose.Types.ObjectId; dateOfBirth?: Date; address?: string;
    membershipId?: string; membershipStatus: 'active' | 'inactive' | 'pending'; membershipFee?: number; membershipPaidDate?: Date;
    referralCode: string; referredBy?: mongoose.Types.ObjectId; totalReferrals: number; totalDonationsReferred: number;
    idCardUrl?: string; certificateUrl?: string; appointmentLetterUrl?: string; isEmailVerified: boolean; lastLogin?: Date;
    tokenVersion: number; created_at: Date; updated_at: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'member', 'volunteer', 'coordinator'], default: 'member', index: true },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
    dateOfBirth: { type: Date }, address: { type: String },
    membershipId: { type: String, unique: true, sparse: true },
    membershipStatus: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending', index: true },
    membershipFee: { type: Number }, membershipPaidDate: { type: Date },
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    totalReferrals: { type: Number, default: 0 }, totalDonationsReferred: { type: Number, default: 0 },
    idCardUrl: { type: String }, certificateUrl: { type: String }, appointmentLetterUrl: { type: String },
    isEmailVerified: { type: Boolean, default: false }, lastLogin: { type: Date }, tokenVersion: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
