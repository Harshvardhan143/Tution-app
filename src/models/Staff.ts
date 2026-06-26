import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  user: mongoose.Types.ObjectId;
  employeeCode?: string;
  qualification?: string;
  subjects: mongoose.Types.ObjectId[];
  batches: string[];
  joiningDate?: Date;
  salary?: number;
}

const staffSchema = new Schema<IStaff>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeCode: { type: String, trim: true },
    qualification: { type: String, trim: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    batches: [{ type: String, trim: true }],
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number },
  },
  { timestamps: true }
);

export const Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', staffSchema);
