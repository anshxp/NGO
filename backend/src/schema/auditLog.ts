import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    actorId?: mongoose.Types.ObjectId;
    action: string;
    method: string;
    path: string;
    statusCode: number;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
    created_at: Date;
}

const auditSchema = new Schema<IAuditLog>({
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, required: true },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
    created_at: { type: Date, default: Date.now, index: true }
}, { versionKey: false });

auditSchema.pre('findOneAndUpdate', function () { throw new Error('Audit logs are immutable'); });
auditSchema.pre('updateMany', function () { throw new Error('Audit logs are immutable'); });
auditSchema.pre('deleteMany', function () { throw new Error('Audit logs are immutable'); });
auditSchema.pre('findOneAndDelete', function () { throw new Error('Audit logs are immutable'); });

export const AuditLogModel: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', auditSchema);
