import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
    name: string;
    code: string;
    fee?: number;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

const DesignationSchema: Schema = new Schema<Readonly<IDesignation>>({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    fee: { type: Number, default: 0 },
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

DesignationSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

export const DesignationModel = mongoose.model<IDesignation>('Designation', DesignationSchema);
