import mongoose, { Schema } from 'mongoose';

const auditSchema = new Schema({
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

export const AuditLogModel = mongoose.model('AuditLog', auditSchema);
