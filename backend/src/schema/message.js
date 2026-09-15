import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  messageId: { type: String, unique: true, required: true }, senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, sendToAll: { type: Boolean, default: false },
  title: { type: String, required: true }, content: { type: String, required: true }, imageUrl: { type: String }, sentDate: { type: Date, default: Date.now }, readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['sent', 'scheduled', 'draft'], default: 'sent' }, scheduledFor: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const MessageModel = mongoose.model('Message', messageSchema);
