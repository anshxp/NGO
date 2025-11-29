import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventRegistration extends Document {
    registrationId: string;
    eventId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    registrationDate: Date;
    amountPaid?: number;
    paymentStatus: 'pending' | 'completed' | 'cancelled';
    receiptUrl?: string;
    created_at: Date;
    updated_at: Date;
}

const eventRegistrationSchema: Schema<IEventRegistration> = new Schema<IEventRegistration>(
    {
        registrationId: {
            type: String,
            unique: true,
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        amountPaid: {
            type: Number
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending'
        },
        receiptUrl: {
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

export const EventRegistrationModel: Model<IEventRegistration> = mongoose.model<IEventRegistration>("EventRegistration", eventRegistrationSchema);
