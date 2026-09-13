import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUserDocument extends Document {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  lastLogin?: string;
}

const adminUserSchema = new Schema<IAdminUserDocument>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: 'Administrator' },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    createdAt: { type: String, required: true },
    lastLogin: { type: String },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const AdminUserModel = mongoose.model<IAdminUserDocument>('AdminUser', adminUserSchema);
