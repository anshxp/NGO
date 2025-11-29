import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBeneficiary extends Document {
    beneficiaryId: string;
    name: string;
    email?: string;
    phone?: string;
    address: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    category: string;
    status: 'active' | 'inactive';
    projects: mongoose.Types.ObjectId[];
    helpHistory: {
        projectId: mongoose.Types.ObjectId;
        helpType: string;
        description: string;
        date: Date;
    }[];
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

const beneficiarySchema: Schema<IBeneficiary> = new Schema<IBeneficiary>(
    {
        beneficiaryId: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        age: {
            type: Number
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        category: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project'
            }
        ],
        helpHistory: [
            {
                projectId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Project'
                },
                helpType: String,
                description: String,
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        notes: {
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

export const BeneficiaryModel: Model<IBeneficiary> = mongoose.model<IBeneficiary>("Beneficiary", beneficiarySchema);
