import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentUploadDocument extends Document {
  userId: mongoose.Types.ObjectId;
  documentType: string;
  person: 'Tax Payer' | 'Spouse' | 'Both' | string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  reviewNotes?: string;
}

const documentUploadSchema = new Schema<IDocumentUploadDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: { type: String, required: true },
    person: { type: String, enum: ['Tax Payer', 'Spouse', 'Both', 'Others'], default: 'Tax Payer' },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' },
    reviewNotes: { type: String, default: '' },
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

export const DocumentUploadModel =
  mongoose.models.DocumentUpload ||
  mongoose.model<IDocumentUploadDocument>('DocumentUpload', documentUploadSchema);
