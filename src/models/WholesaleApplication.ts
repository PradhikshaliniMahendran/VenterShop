import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWholesaleApplication extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  city: string;
  province: string;
  postalCode: string;
  expectedOrderVolume: string; // e.g. "<$1000/mo", "$1000-$5000/mo", etc.
  wholesaleCategory?: string; // Type of business (e.g. Retailer, Restaurant, etc.)
  additionalNotes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

const WholesaleApplicationSchema = new Schema<IWholesaleApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    businessAddress: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    expectedOrderVolume: { type: String, required: true },
    wholesaleCategory: { type: String },
    additionalNotes: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const WholesaleApplication: Model<IWholesaleApplication> =
  mongoose.models.WholesaleApplication ||
  mongoose.model<IWholesaleApplication>('WholesaleApplication', WholesaleApplicationSchema);

export default WholesaleApplication;
