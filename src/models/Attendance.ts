import mongoose, { Document, Schema } from 'mongoose';
import { ATTENDANCE_STATUS, AttendanceStatus } from '@/config/constants';

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  date: Date;
  subject?: mongoose.Types.ObjectId;
  batch?: string;
  status: AttendanceStatus;
  markedBy?: mongoose.Types.ObjectId;
  lectureSlot?: number;
  academicYear?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    batch: { type: String, trim: true },
    status: { type: String, enum: Object.values(ATTENDANCE_STATUS), required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lectureSlot: { type: Number },
    academicYear: { type: String, trim: true },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance marks for a student on same day/slot
attendanceSchema.index({ student: 1, date: 1, lectureSlot: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', attendanceSchema);
