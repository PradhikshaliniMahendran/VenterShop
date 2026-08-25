import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  customerTypes: ('NORMAL' | 'COMMUNITY' | 'WHOLESALE')[];
  categoryIds: mongoose.Types.ObjectId[];
  productIds: mongoose.Types.ObjectId[];
  communityIds: mongoose.Types.ObjectId[];
  minimumOrderValue: number;
  maximumDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  perCustomerLimit?: number;
  voucherRequired: boolean; // If true, this promotion is only triggered when a voucher code is entered
  isActive: boolean; // Admin can disable manually
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    customerTypes: {
      type: [String],
      enum: ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
      default: ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
    },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    communityIds: [{ type: Schema.Types.ObjectId, ref: 'Community' }],
    minimumOrderValue: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number },
    perCustomerLimit: { type: Number, default: 1 },
    voucherRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
