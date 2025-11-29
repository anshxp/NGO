import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    authorId: mongoose.Types.ObjectId;
    status: 'draft' | 'published' | 'archived';
    views: number;
    publishedDate?: Date;
    created_at: Date;
    updated_at: Date;
}

const newsSchema: Schema<INews> = new Schema<INews>(
    {
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        excerpt: {
            type: String
        },
        imageUrl: {
            type: String
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        },
        views: {
            type: Number,
            default: 0
        },
        publishedDate: {
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

export const NewsModel: Model<INews> = mongoose.model<INews>("News", newsSchema);
