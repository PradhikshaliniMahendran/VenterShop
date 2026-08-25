import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  adminEmail: string;
  adminName: string;
  action: string; // e.g. 'PRODUCT_CREATED', 'WHOLESALE_APPROVED'
  target: string; // e.g. SKU, customer email, order ID
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminEmail: { type: String, required: true, lowercase: true, index: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    target: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
