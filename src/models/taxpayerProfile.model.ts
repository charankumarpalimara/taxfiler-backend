import mongoose, { Schema, Document } from 'mongoose';

export interface ITaxpayerProfileDocument extends Document {
  user: mongoose.Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  dob: string;
  filingStatus: string;
  occupation: string;
}

const taxpayerProfileSchema = new Schema<ITaxpayerProfileDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, required: true },
    ssn: { type: String, required: true },
    dob: { type: String, required: true },
    filingStatus: { type: String, default: 'Single' },
    occupation: { type: String, default: '' },
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

export const TaxpayerProfileModel =
  mongoose.models.TaxpayerProfile ||
  mongoose.model<ITaxpayerProfileDocument>('TaxpayerProfile', taxpayerProfileSchema);
