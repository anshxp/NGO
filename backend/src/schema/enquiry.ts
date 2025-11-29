import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'closed';
    reply?: string;
    repliedBy?: mongoose.Types.ObjectId;
    repliedAt?: Date;
    created_at: Date;
    updated_at: Date;
}

const enquirySchema: Schema<IEnquiry> = new Schema<IEnquiry>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'closed'],
            default: 'new'
        },
        reply: {
            type: String
        },
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        repliedAt: {
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

export const EnquiryModel: Model<IEnquiry> = mongoose.model<IEnquiry>("Enquiry", enquirySchema);
