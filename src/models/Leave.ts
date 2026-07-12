import mongoose, { Document, Schema } from 'mongoose';

export interface ILeave extends Document {
  staff: mongoose.Types.ObjectId;
  leaveType: 'casual' | 'sick' | 'earned';
  fromDate: Date;
  toDate: Date;
  isHalfDay: boolean;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  totalDays: number;
}

const leaveSchema = new Schema<ILeave>(
  {
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, enum: ['casual', 'sick', 'earned'], required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    isHalfDay: { type: Boolean, default: false },
    reason: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    totalDays: { type: Number, required: true, min: 0.5 },
  },
  { timestamps: true }
);

export const Leave = mongoose.models.Leave || mongoose.model<ILeave>('Leave', leaveSchema);
