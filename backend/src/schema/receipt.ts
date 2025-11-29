import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReceipt extends Document {
    receiptId: string;
    receiptType: 'membership' | 'donation' | 'event' | 'cash_donation';
    userId: mongoose.Types.ObjectId;
    referenceId: string;
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    date: Date;
    pdfUrl?: string;
    qrCode?: string;
    status: 'issued' | 'voided';
    created_at: Date;
    updated_at: Date;
}

const receiptSchema: Schema<IReceipt> = new Schema<IReceipt>(
    {
        receiptId: {
            type: String,
            unique: true,
            required: true
        },
        receiptType: {
            type: String,
            enum: ['membership', 'donation', 'event', 'cash_donation'],
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        referenceId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        transactionId: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        pdfUrl: {
            type: String
        },
        qrCode: {
            type: String
        },
        status: {
            type: String,
            enum: ['issued', 'voided'],
            default: 'issued'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const ReceiptModel: Model<IReceipt> = mongoose.model<IReceipt>("Receipt", receiptSchema);
