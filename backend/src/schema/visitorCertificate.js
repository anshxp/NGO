import mongoose, { Schema } from "mongoose";
const visitorCertificateSchema = new Schema({
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
export const VisitorCertificateModel = mongoose.model("VisitorCertificate", visitorCertificateSchema);
