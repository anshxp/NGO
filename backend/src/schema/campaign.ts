import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
    title: string;
    description: string;
    goal: number;
    raised: number;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    status: 'active' | 'completed' | 'cancelled';
    organizer: mongoose.Types.ObjectId;
    donors: mongoose.Types.ObjectId[];
    donationCount: number;
    created_at: Date;
    updated_at: Date;
}

const campaignSchema: Schema<ICampaign> = new Schema<ICampaign>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        goal: {
            type: Number,
            required: true
        },
        raised: {
            type: Number,
            default: 0
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        imageUrl: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active'
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
        donationCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const CampaignModel: Model<ICampaign> = mongoose.model<ICampaign>("Campaign", campaignSchema);
