import mongoose, { Schema, Document } from 'mongoose';

export interface IBankDetailsDocument extends Document {
  user: mongoose.Types.ObjectId;
  bankName: string;
  accountType: 'Checking' | 'Savings' | string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

const bankDetailsSchema = new Schema<IBankDetailsDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bankName: { type: String, default: '' },
    accountType: { type: String, default: 'Checking' },
    accountNumber: { type: String, default: '' },
    routingNumber: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
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

export const BankDetailsModel =
  mongoose.models.BankDetails ||
  mongoose.model<IBankDetailsDocument>('BankDetails', bankDetailsSchema);
