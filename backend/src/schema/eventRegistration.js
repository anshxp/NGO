import mongoose, { Schema } from 'mongoose';

const eventRegistrationSchema = new Schema({
  registrationId: { type: String, unique: true, required: true }, eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationDate: { type: Date, default: Date.now }, amountPaid: { type: Number }, paymentStatus: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }, receiptUrl: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const EventRegistrationModel = mongoose.model('EventRegistration', eventRegistrationSchema);
