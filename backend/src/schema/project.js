import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  projectId: { type: String, unique: true, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, objective: { type: String }, totalBudget: { type: Number, required: true }, fundsReceived: { type: Number, default: 0 }, expenses: { type: Number, default: 0 },
  status: { type: String, enum: ['planning', 'active', 'completed', 'paused'], default: 'planning' }, startDate: { type: Date, default: Date.now }, endDate: { type: Date }, imageUrl: { type: String }, organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, donors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], beneficiaries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' }], reports: [{ type: String }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const ProjectModel = mongoose.model('Project', projectSchema);
