import mongoose, { Schema, Document } from 'mongoose';

export interface IDependentDocument extends Document {
  user: mongoose.Types.ObjectId;
  name?: string;
  firstName: string;
  lastName?: string;
  ssn: string;
  dob: string;
  relationship: string;
}

const dependentSchema = new Schema<IDependentDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: '' },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    ssn: { type: String, required: true },
    dob: { type: String, required: true },
    relationship: { type: String, required: true },
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

export const DependentModel =
  mongoose.models.Dependent ||
  mongoose.model<IDependentDocument>('Dependent', dependentSchema);
