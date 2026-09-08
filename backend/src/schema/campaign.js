import mongoose, { Schema } from 'mongoose';

const campaignSchema = new Schema({
  title: { type: String, required: true }, description: { type: String, required: true }, goal: { type: Number, required: true },
  raised: { type: Number, default: 0 }, startDate: { type: Date, default: Date.now }, endDate: { type: Date, required: true }, imageUrl: { type: String },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], donationCount: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const CampaignModel = mongoose.model('Campaign', campaignSchema);
