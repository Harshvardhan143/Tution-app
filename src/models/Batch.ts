import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  grade: string;
  timing?: string;
  days: string[];
  maxStudents?: number;
  students: mongoose.Types.ObjectId[];
  staff: mongoose.Types.ObjectId[];
  isActive: boolean;
}

const batchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    timing: { type: String, trim: true },
    days: [{ type: String, trim: true }],
    maxStudents: { type: Number },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    staff: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Batch = mongoose.models.Batch || mongoose.model<IBatch>('Batch', batchSchema);
