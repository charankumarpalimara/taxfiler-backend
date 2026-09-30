import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralDocument extends Document {
  user: mongoose.Types.ObjectId;
  referredName: string;
  referredEmail: string;
  status: string;
  referralStatus: 'pending' | 'completed' | 'active';
  joinedDate?: string;
  rewardAmount: number;
  rewardStatus: 'pending' | 'paid';
  referralCodeUsed?: string;
}

const referralSchema = new Schema<IReferralDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredName: { type: String, required: true },
    referredEmail: { type: String, required: true },
    status: { type: String, default: 'active' },
    referralStatus: { type: String, enum: ['pending', 'completed', 'active'], default: 'pending' },
    joinedDate: { type: String, default: () => new Date().toISOString() },
    rewardAmount: { type: Number, default: 50 },
    rewardStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    referralCodeUsed: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ReferralModel =
  mongoose.models.Referral ||
  mongoose.model<IReferralDocument>('Referral', referralSchema);
