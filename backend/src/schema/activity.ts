import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivity extends Document {
    title: string;
    description: string;
    imageUrls: string[];
    authorId: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    comments: {
        userId: mongoose.Types.ObjectId;
        comment: string;
        createdAt: Date;
    }[];
    status: 'published' | 'draft';
    created_at: Date;
    updated_at: Date;
}

const activitySchema: Schema<IActivity> = new Schema<IActivity>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrls: [
            {
                type: String
            }
        ],
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                comment: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        status: {
            type: String,
            enum: ['published', 'draft'],
            default: 'published'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const ActivityModel: Model<IActivity> = mongoose.model<IActivity>("Activity", activitySchema);
