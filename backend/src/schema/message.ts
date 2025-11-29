import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
    messageId: string;
    senderId: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId;
    sendToAll: boolean;
    title: string;
    content: string;
    imageUrl?: string;
    sentDate: Date;
    readBy: mongoose.Types.ObjectId[];
    status: 'sent' | 'scheduled' | 'draft';
    scheduledFor?: Date;
    created_at: Date;
    updated_at: Date;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
    {
        messageId: {
            type: String,
            unique: true,
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sendToAll: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        sentDate: {
            type: Date,
            default: Date.now
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        status: {
            type: String,
            enum: ['sent', 'scheduled', 'draft'],
            default: 'sent'
        },
        scheduledFor: {
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

export const MessageModel: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);
