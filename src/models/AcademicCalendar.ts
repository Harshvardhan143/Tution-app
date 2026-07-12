import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademicCalendar extends Document {
  title: string;
  type: 'holiday' | 'exam' | 'event' | 'fee_due' | 'test';
  fromDate: Date;
  toDate: Date;
  description?: string;
  targetRole: 'all' | 'student' | 'staff';
}

const academicCalendarSchema = new Schema<IAcademicCalendar>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['holiday', 'exam', 'event', 'fee_due', 'test'], required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    description: { type: String, trim: true },
    targetRole: { type: String, enum: ['all', 'student', 'staff'], default: 'all' },
  },
  { timestamps: true }
);

export const AcademicCalendar = mongoose.models.AcademicCalendar || mongoose.model<IAcademicCalendar>('AcademicCalendar', academicCalendarSchema);
