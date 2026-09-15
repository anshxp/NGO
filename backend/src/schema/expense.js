import mongoose, { Schema } from 'mongoose';

const expenseSchema = new Schema({
  expenseId: { type: String, unique: true, required: true }, amount: { type: Number, required: true }, category: { type: String, required: true }, description: { type: String, required: true }, date: { type: Date, default: Date.now },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, receiptUrl: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const ExpenseModel = mongoose.model('Expense', expenseSchema);
