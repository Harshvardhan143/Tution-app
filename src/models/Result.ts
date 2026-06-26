import mongoose, { Document, Schema } from 'mongoose';

export interface IResultSubject {
  subject: mongoose.Types.ObjectId;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  status: 'pass' | 'fail';
}

export interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  academicYear: string;
  term: string;
  testDate?: Date;
  results: IResultSubject[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  rank?: number;
}

const resultSubjectSchema = new Schema<IResultSubject>({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  marksObtained: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true, min: 1 },
  grade: { type: String, trim: true },
  status: { type: String, enum: ['pass', 'fail'], required: true },
});

const resultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academicYear: { type: String, required: true, trim: true },
    term: { type: String, required: true, trim: true },
    testDate: { type: Date },
    results: [resultSubjectSchema],
    totalMarks: { type: Number, required: true, min: 0 },
    obtainedMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true }
);

export const Result = mongoose.models.Result || mongoose.model<IResult>('Result', resultSchema);
