import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto-delete document when expired
    attempts: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const OTP: Model<IOTP> = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
