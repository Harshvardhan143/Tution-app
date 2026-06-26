import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  event: string;
  userId?: mongoose.Types.ObjectId;
  outcome: 'success' | 'failure';
  severity: 'info' | 'warn' | 'error' | 'critical';
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    event: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    outcome: { type: String, enum: ['success', 'failure'], required: true },
    severity: { type: String, enum: ['info', 'warn', 'error', 'critical'], required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// TTL Index for auto-deletion
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
