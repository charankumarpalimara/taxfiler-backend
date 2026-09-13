import mongoose, { Schema, Document } from 'mongoose';
import { Submission, SubmissionStatus } from '../types/index.js';

export interface ISubmissionDocument extends Omit<Submission, 'id'>, Document {
  id: string;
}

const submissionSchema = new Schema<ISubmissionDocument>(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['consultation', 'quick_contact'], default: 'consultation' },
    firstName: { type: String },
    lastName: { type: String },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'English' },
    scheduledDate: { type: String, default: 'Not Scheduled' },
    scheduledTime: { type: String, default: '10:00 AM CST' },
    services: { type: [String], default: ['Tax Preparation'] },
    leadSource: { type: String, default: 'Website Direct' },
    notes: { type: String, default: '' },
    staffNote: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Contacted', 'Completed', 'Archived'],
      default: 'New',
    },
    createdAt: { type: String, required: true },
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

export const SubmissionModel = mongoose.model<ISubmissionDocument>('Submission', submissionSchema);
