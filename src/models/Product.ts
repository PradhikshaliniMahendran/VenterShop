import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBulkPricing {
  minQty: number;
  discountPercent: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  shortDescription?: string;
  images: string[]; // Cloudinary secure URLs
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  wholesaleMinQty: number;
  bulkPricing: IBulkPricing[];
  eligibleCustomerTypes: ('NORMAL' | 'COMMUNITY' | 'WHOLESALE')[];
  createdAt: Date;
  updatedAt: Date;
}

const BulkPricingSchema = new Schema<IBulkPricing>({
  minQty: { type: Number, required: true, min: 1 },
  discountPercent: { type: Number, required: true, min: 0, max: 100 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, index: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    images: { type: [String], default: [] },
    retailPrice: { type: Number, required: true, min: 0 },
    communityPrice: { type: Number, required: true, min: 0 },
    wholesalePrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    wholesaleMinQty: { type: Number, default: 1, min: 1 },
    bulkPricing: [BulkPricingSchema],
    eligibleCustomerTypes: {
      type: [String],
      enum: ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
      default: ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
