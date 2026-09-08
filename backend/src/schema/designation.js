import mongoose, { Schema } from 'mongoose';

const DesignationSchema = new Schema({
  name: { type: String, required: true, trim: true }, code: { type: String, required: true, unique: true, uppercase: true }, fee: { type: Number, default: 0 }, description: { type: String },
  created_at: { type: Date, default: Date.now }, updated_at: { type: Date, default: Date.now }
});

DesignationSchema.pre('save', function (next) { this.updated_at = new Date(); next(); });
export const DesignationModel = mongoose.model('Designation', DesignationSchema);
