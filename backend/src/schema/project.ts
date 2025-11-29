import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
    projectId: string;
    title: string;
    description: string;
    objective?: string;
    totalBudget: number;
    fundsReceived: number;
    expenses: number;
    status: 'planning' | 'active' | 'completed' | 'paused';
    startDate: Date;
    endDate?: Date;
    imageUrl?: string;
    organizer: mongoose.Types.ObjectId;
    donors: mongoose.Types.ObjectId[];
    beneficiaries: mongoose.Types.ObjectId[];
    reports: string[];
    created_at: Date;
    updated_at: Date;
}

const projectSchema: Schema<IProject> = new Schema<IProject>(
    {
        projectId: {
            type: String,
            unique: true,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        objective: {
            type: String
        },
        totalBudget: {
            type: Number,
            required: true
        },
        fundsReceived: {
            type: Number,
            default: 0
        },
        expenses: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['planning', 'active', 'completed', 'paused'],
            default: 'planning'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        imageUrl: {
            type: String
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        donors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        beneficiaries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Beneficiary'
            }
        ],
        reports: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const ProjectModel: Model<IProject> = mongoose.model<IProject>("Project", projectSchema);
