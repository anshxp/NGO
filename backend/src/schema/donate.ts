import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonate extends Document {
    donator: string;
    donatorEmail: string;
    contact: number;
    address?: string;
    transactionId: string;
    timestamp: Date;
    amount: number;
    payment_method: string;
    payment_status: "SUCCESS" | "FAILED" | "PENDING";
    donation_type: string;
    isAnonymous: boolean;
    referredBy?: mongoose.Types.ObjectId;
    receiptUrl?: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
    created_at: Date;
    updated_at: Date;
}

const donateSchema: Schema<IDonate> = new Schema<IDonate>(
    {
        donator: {
            type: String,
            required: true
        },
        donatorEmail: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
            required: true
        },
        address: {
            type: String
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        payment_method: {
            type: String,
            required: true,
            enum: ['razorpay', 'phonepe', 'payumoney', 'cash', 'bank_transfer', 'upi']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        donation_type: {
            type: String,
            required: true,
            enum: ['one-time', 'monthly', 'campaign', 'general']
        },
        payment_status: {
            type: String,
            enum: ['SUCCESS', 'FAILED', 'PENDING'],
            default: 'PENDING'
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        receiptUrl: {
            type: String
        },
        orderId: {
            type: String,
            index: true
        },
        paymentId: {
            type: String,
            index: true
        },
        signature: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const DonateModel: Model<IDonate> = mongoose.model<IDonate>("Donate", donateSchema);
