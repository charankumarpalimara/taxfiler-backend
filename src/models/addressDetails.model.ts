import mongoose, { Schema, Document } from 'mongoose';

export interface IAddressSubSchema {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface IAddressDetailsDocument extends Document {
  user: mongoose.Types.ObjectId;
  currentAddress: IAddressSubSchema;
  taxYearAddress: IAddressSubSchema;
}

const addressSubSchema = new Schema<IAddressSubSchema>(
  {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  { _id: false }
);

const addressDetailsSchema = new Schema<IAddressDetailsDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentAddress: { type: addressSubSchema, default: {} },
    taxYearAddress: { type: addressSubSchema, default: {} },
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

export const AddressDetailsModel =
  mongoose.models.AddressDetails ||
  mongoose.model<IAddressDetailsDocument>('AddressDetails', addressDetailsSchema);
