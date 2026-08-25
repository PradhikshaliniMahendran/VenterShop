import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVoucher extends Document {
  code: string; // e.g. GROCERY10
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  customerTypes: ('NORMAL' | 'COMMUNITY' | 'WHOLESALE')[];
  categoryIds: mongoose.Types.ObjectId[]; // Scopes voucher only to these categories
  productIds: mongoose.Types.ObjectId[];  // Scopes voucher only to these products
  communityIds: mongoose.Types.ObjectId[]; // Scopes voucher only to members of these communities
  minimumOrderValue: number; // Minimum cart value required
  maximumDiscount?: number;  // Max discount cap for PERCENTAGE discount
  usageLimit?: number;       // Max global uses
  perCustomerLimit: number;  // Max uses per user (default 1)
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usedCount: number; // Current global use counter
  createdAt: Date;
  updatedAt: Date;
}

export interface IVoucherUsage extends Document {
  voucherId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  usedAt: Date;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
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
    usageLimit: { type: Number },
    perCustomerLimit: { type: Number, default: 1, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const VoucherUsageSchema = new Schema<IVoucherUsage>(
  {
    voucherId: { type: Schema.Types.ObjectId, ref: 'Voucher', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
export const Voucher: Model<IVoucher> = mongoose.models.Voucher || mongoose.model<IVoucher>('Voucher', VoucherSchema);
export const VoucherUsage: Model<IVoucherUsage> =
  mongoose.models.VoucherUsage || mongoose.model<IVoucherUsage>('VoucherUsage', VoucherUsageSchema);
