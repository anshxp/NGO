import mongoose, { Schema } from 'mongoose';

const enquirySchema = new Schema({
  name: { type: String, required: true }, email: { type: String, required: true }, phone: { type: String, required: true }, subject: { type: String, required: true }, message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' }, reply: { type: String }, repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, repliedAt: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const EnquiryModel = mongoose.model('Enquiry', enquirySchema);
