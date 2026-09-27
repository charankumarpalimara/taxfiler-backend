import mongoose, { Schema, Document } from 'mongoose';
import { User, PortalStatus } from '../types/index.js';

export interface IUserDocument extends Omit<User, 'id'>, Document {
  id: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'client'], default: 'user' },
    portalStatus: {
      type: String,
      enum: ['Verified', 'Active', 'Pending Review', 'Suspended'],
      default: 'Pending Review',
    },
    accountType: { type: String, default: 'Individual Portal' },
    createdAt: { type: String, required: true },
    lastLogin: { type: String, default: 'Pending first login' },
    updatedAt: { type: String },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
