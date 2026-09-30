import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password?: string;
  mobile?: string;
  phone?: string;
  referralId?: string;
  referralBy?: string;
  image?: string;
  address?: string;
  role: 'user' | 'client' | 'admin';
  portalStatus?: string;
  accountType?: string;
  createdAt?: string;
  lastLogin?: string;
  updatedAt?: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    referralId: { type: String, default: '' },
    referralBy: { type: String, default: '' },
    image: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, enum: ['user', 'client', 'admin'], default: 'user' },
    portalStatus: { type: String, default: 'Active' },
    accountType: { type: String, default: 'Individual Tax Filer' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    lastLogin: { type: String, default: 'Pending first login' },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
