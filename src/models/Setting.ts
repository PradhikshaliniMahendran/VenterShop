import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  storeName: string;
  tagline: string;
  freeDeliveryThreshold: number;
  currency: string;
  primaryEmail?: string;
  primaryPhone?: string;
  address?: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    storeName: { type: String, default: 'VENTERSHOP' },
    tagline: { type: String, default: 'Your Trusted Online Store for Quality Products' },
    freeDeliveryThreshold: { type: Number, default: 75, min: 0 },
    currency: { type: String, default: 'CAD' },
    primaryEmail: { type: String, lowercase: true, trim: true },
    primaryPhone: { type: String, trim: true },
    address: { type: String },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;
