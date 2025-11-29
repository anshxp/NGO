import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorCertificate extends Document {
    certificateId: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    certificateTemplate: 1 | 2 | 3 | 4 | 5 | 6;
    title: string;
    description?: string;
    issueDate: Date;
    pdfUrl?: string;
    qrCode?: string;
    verificationCode: string;
    isVerified: boolean;
    created_at: Date;
    updated_at: Date;
}

const visitorCertificateSchema: Schema<IVisitorCertificate> = new Schema<IVisitorCertificate>(
    {
        certificateId: {
            type: String,
            unique: true,
            required: true
        },
        visitorName: {
            type: String,
            required: true
        },
        visitorEmail: {
            type: String,
            required: true
        },
        visitorPhone: {
            type: String,
            required: true
        },
        certificateTemplate: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6],
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

export const VisitorCertificateModel: Model<IVisitorCertificate> = mongoose.model<IVisitorCertificate>("VisitorCertificate", visitorCertificateSchema);
