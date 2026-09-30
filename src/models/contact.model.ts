import mongoose, { Schema, Document } from 'mongoose';

export interface IContactDocument extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  phone: string;
  alternateEmail?: string;
  alternatePhone?: string;
}

const contactSchema = new Schema<IContactDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    alternateEmail: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
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

export const ContactModel =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>('Contact', contactSchema);
