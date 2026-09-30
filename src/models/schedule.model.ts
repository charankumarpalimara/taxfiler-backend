import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleDocument extends Document {
  user?: mongoose.Types.ObjectId;
  bookedBy?: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime?: string;
  timezone: string;
  reason?: string;
  preferredMethod: 'email' | 'phone' | string;
  admin?: string;
  requestType?: string;
  status: 'booked' | 'Booked' | 'available' | 'completed' | 'requested';
}

const scheduleSchema = new Schema<IScheduleDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, default: '' },
    timezone: { type: String, default: 'CST' },
    reason: { type: String, default: '' },
    preferredMethod: { type: String, default: 'phone' },
    admin: { type: String, default: 'Admin Team' },
    requestType: { type: String, default: 'custom' },
    status: { type: String, default: 'available' },
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

export const ScheduleModel =
  mongoose.models.Schedule ||
  mongoose.model<IScheduleDocument>('Schedule', scheduleSchema);
