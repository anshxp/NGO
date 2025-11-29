import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInternship extends Document {
    internshipId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    stipend?: number;
    positions: number;
    postedBy: mongoose.Types.ObjectId;
    applicants: mongoose.Types.ObjectId[];
    selectedInterns: mongoose.Types.ObjectId[];
    status: 'open' | 'closed' | 'completed';
    created_at: Date;
    updated_at: Date;
}

const internshipSchema: Schema<IInternship> = new Schema<IInternship>(
    {
        internshipId: {
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
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        stipend: {
            type: Number
        },
        positions: {
            type: Number,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        selectedInterns: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        status: {
            type: String,
            enum: ['open', 'closed', 'completed'],
            default: 'open'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const InternshipModel: Model<IInternship> = mongoose.model<IInternship>("Internship", internshipSchema);
