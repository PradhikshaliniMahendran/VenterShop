import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'SUPER_ADMIN'], default: 'ADMIN' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
