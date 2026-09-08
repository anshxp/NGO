import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
  eventId: { type: String, unique: true, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, eventDate: { type: Date, required: true }, eventEndDate: { type: Date }, location: { type: String, required: true },
  eventType: { type: String, enum: ['free', 'paid'], required: true }, entryFee: { type: Number }, imageUrl: { type: String }, organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], registrationCount: { type: Number, default: 0 }, status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const EventModel = mongoose.model('Event', eventSchema);
