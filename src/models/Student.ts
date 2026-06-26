import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  rollNo?: string;
  enrollmentNo?: string;
  grade: string;
  batch?: string;
  subjects: mongoose.Types.ObjectId[];
  academicYear?: string;
  admissionDate?: Date;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  admissionStatus: 'active' | 'inactive' | 'graduated';
}

const studentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNo: { type: String, trim: true },
    enrollmentNo: { type: String, trim: true },
    grade: { type: String, required: true, trim: true },
    batch: { type: String, trim: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    academicYear: { type: String, trim: true },
    admissionDate: { type: Date, default: Date.now },
    parentName: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    admissionStatus: { 
      type: String, 
      enum: ['active', 'inactive', 'graduated'], 
      default: 'active' 
    },
  },
  { timestamps: true }
);

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
