import mongoose, { Document, Schema } from 'mongoose';

export interface IExam {
  subject: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  room?: string;
  syllabus?: string;
  maxMarks?: number;
}

export interface IExamSchedule extends Document {
  term: string;
  grade: string;
  batch: string;
  exams: IExam[];
  academicYear: string;
}

const examSchema = new Schema<IExam>({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, trim: true },
  endTime: { type: String, required: true, trim: true },
  room: { type: String, trim: true },
  syllabus: { type: String, trim: true },
  maxMarks: { type: Number, min: 1 },
});

const examScheduleSchema = new Schema<IExamSchedule>(
  {
    term: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    exams: [examSchema],
    academicYear: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const ExamSchedule = mongoose.models.ExamSchedule || mongoose.model<IExamSchedule>('ExamSchedule', examScheduleSchema);
