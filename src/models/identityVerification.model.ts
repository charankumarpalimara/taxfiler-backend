import mongoose, { Schema, Document } from 'mongoose';

export interface IIdentityVerificationDocument extends Document {
  user: mongoose.Types.ObjectId;
  licenseNumber: string;
  stateOfIssue: string;
  expirationDate: string;
  licenseDocument?: string;
}

const identityVerificationSchema = new Schema<IIdentityVerificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    licenseNumber: { type: String, default: '' },
    stateOfIssue: { type: String, default: '' },
    expirationDate: { type: String, default: '' },
    licenseDocument: { type: String, default: '' },
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

export const IdentityVerificationModel =
  mongoose.models.IdentityVerification ||
  mongoose.model<IIdentityVerificationDocument>('IdentityVerification', identityVerificationSchema);
