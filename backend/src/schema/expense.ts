import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
    expenseId: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
    projectId?: mongoose.Types.ObjectId;
    approvedBy?: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    receiptUrl?: string;
    created_at: Date;
    updated_at: Date;
}

const expenseSchema: Schema<IExpense> = new Schema<IExpense>(
    {
        expenseId: {
            type: String,
            unique: true,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        receiptUrl: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const ExpenseModel: Model<IExpense> = mongoose.model<IExpense>("Expense", expenseSchema);
