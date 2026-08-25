import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  _id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  addressType: 'Home' | 'Business' | 'Other';
  isDefault: boolean;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE';
  status: 'ACTIVE' | 'SUSPENDED';
  profileImage?: string;
  communityId: mongoose.Types.ObjectId | null;
  communityStatus: 'NONE' | 'PENDING' | 'APPROVED';
  communityJoinDate?: Date;
  preferredLanguage: 'en' | 'ta';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'Canada' },
  phone: { type: String, required: true },
  addressType: { type: String, enum: ['Home', 'Business', 'Other'], default: 'Home' },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    customerType: { type: String, enum: ['NORMAL', 'COMMUNITY', 'WHOLESALE'], default: 'NORMAL' },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    profileImage: { type: String },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', default: null },
    communityStatus: { type: String, enum: ['NONE', 'PENDING', 'APPROVED'], default: 'NONE' },
    communityJoinDate: { type: Date },
    preferredLanguage: { type: String, enum: ['en', 'ta'], default: 'en' },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
