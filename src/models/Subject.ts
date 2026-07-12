import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code?: string;
  grade?: string;
  description?: string;
  isActive: boolean;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subject = mongoose.models.Subject || mongoose.model<ISubject>('Subject', subjectSchema);
