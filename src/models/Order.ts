import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number; // Price per item paid by customer
  quantity: number;
  total: number; // price * quantity
}

export interface IOrderAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder extends Document {
  orderNumber: string; // e.g. VS-2026-000001
  userId: mongoose.Types.ObjectId;
  customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE';
  communityId: mongoose.Types.ObjectId | null;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  voucherId: mongoose.Types.ObjectId | null;
  voucherCode?: string;
  deliveryAddress: IOrderAddress;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 0 },
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'Canada' },
  phone: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerType: { type: String, enum: ['NORMAL', 'COMMUNITY', 'WHOLESALE'], required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', default: null },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    deliveryFee: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    voucherId: { type: Schema.Types.ObjectId, ref: 'Voucher', default: null },
    voucherCode: { type: String },
    deliveryAddress: { type: OrderAddressSchema, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
