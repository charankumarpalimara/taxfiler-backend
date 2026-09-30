import mongoose, { Schema, Document } from 'mongoose';

export interface ISpouseDetailsDocument extends Document {
  user: mongoose.Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  dob: string;
}

const spouseDetailsSchema = new Schema<ISpouseDetailsDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    ssn: { type: String, default: '' },
    dob: { type: String, default: '' },
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

export const SpouseDetailsModel =
  mongoose.models.SpouseDetails ||
  mongoose.model<ISpouseDetailsDocument>('SpouseDetails', spouseDetailsSchema);
