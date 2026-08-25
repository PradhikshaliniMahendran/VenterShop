import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  isActive: boolean;
  membershipCode?: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    membershipCode: { type: String, trim: true },
    memberCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);

export default Community;
