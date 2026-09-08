import mongoose, { Schema } from 'mongoose';

const beneficiarySchema = new Schema({
  beneficiaryId: { type: String, unique: true, required: true },
  name: { type: String, required: true }, email: { type: String }, phone: { type: String },
  address: { type: String, required: true }, age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] }, category: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  helpHistory: [{ projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, helpType: String, description: String, date: { type: Date, default: Date.now } }],
  notes: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const BeneficiaryModel = mongoose.model('Beneficiary', beneficiarySchema);
