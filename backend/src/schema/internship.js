import mongoose, { Schema } from 'mongoose';

const internshipSchema = new Schema({
  internshipId: { type: String, unique: true, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, startDate: { type: Date, required: true }, endDate: { type: Date, required: true }, location: { type: String, required: true }, stipend: { type: Number }, positions: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], selectedInterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const InternshipModel = mongoose.model('Internship', internshipSchema);
