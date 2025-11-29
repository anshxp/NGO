import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMembership extends Document {
    memberId: string;
    userId: mongoose.Types.ObjectId;
    designationId: mongoose.Types.ObjectId;
    membershipStatus: 'active' | 'inactive' | 'suspended' | 'expired';
    joiningDate: Date;
    expiryDate?: Date;
    membershipFee: number;
    receiptUrl?: string;
    idCardUrl?: string;
    appointmentLetterUrl?: string;
    qrCode?: string;
    renewalDate?: Date;
    created_at: Date;
    updated_at: Date;
}

const membershipSchema: Schema<IMembership> = new Schema<IMembership>(
    {
        memberId: {
            type: String,
            unique: true,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        designationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Designation',
            required: true
        },
        membershipStatus: {
            type: String,
            enum: ['active', 'inactive', 'suspended', 'expired'],
            default: 'active'
        },
        joiningDate: {
            type: Date,
            default: Date.now
        },
        expiryDate: {
            type: Date
        },
        membershipFee: {
            type: Number,
            required: true
        },
        receiptUrl: {
            type: String
        },
        idCardUrl: {
            type: String
        },
        appointmentLetterUrl: {
            type: String
        },
        qrCode: {
            type: String
        },
        renewalDate: {
            type: Date
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const MembershipModel: Model<IMembership> = mongoose.model<IMembership>("Membership", membershipSchema);
