import mongoose, { Schema, Document } from 'mongoose';
import { Registration, PortalStatus } from '../types/index.js';

export interface IRegistrationDocument extends Omit<Registration, 'id'>, Document {
  id: string;
}

const registrationSchema = new Schema<IRegistrationDocument>(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    portalStatus: {
      type: String,
      enum: ['Verified', 'Active', 'Pending Review', 'Suspended'],
      default: 'Pending Review',
    },
    accountType: { type: String, default: 'Business Portal' },
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
        return ret;
      },
    },
  }
);

export const RegistrationModel = mongoose.model<IRegistrationDocument>('Registration', registrationSchema);
