import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
    certificateId: string;
    recipientId: mongoose.Types.ObjectId;
    recipientType: 'member' | 'visitor';
    recipientName: string;
    recipientEmail: string;
    title: string;
    description?: string;
    issueDate: Date;
    certificateUrl?: string;
    pdfUrl?: string;
    qrCode?: string;
    verificationCode: string;
    isVerified: boolean;
    created_at: Date;
    updated_at: Date;
}

const certificateSchema: Schema<ICertificate> = new Schema<ICertificate>(
    {
        certificateId: {
            type: String,
            unique: true,
            required: true
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipientType: {
            type: String,
            enum: ['member', 'visitor'],
            required: true
        },
        recipientName: {
            type: String,
            required: true
        },
        recipientEmail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        issueDate: {
            type: Date,
            default: Date.now
        },
        certificateUrl: {
            type: String
        },
        pdfUrl: {
            type: String
        },
        qrCode: {
            type: String
        },
        verificationCode: {
            type: String,
            unique: true,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const CertificateModel: Model<ICertificate> = mongoose.model<ICertificate>("Certificate", certificateSchema);
