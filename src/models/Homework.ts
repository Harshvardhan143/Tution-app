import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission {
  student: mongoose.Types.ObjectId;
  submittedAt: Date;
  status: 'submitted' | 'late' | 'pending';
}

export interface IHomework extends Document {
  title: string;
  description?: string;
  subject: mongoose.Types.ObjectId;
  batch: string;
  assignedBy: mongoose.Types.ObjectId;
  dueDate: Date;
  attachmentUrl?: string;
  submissions: ISubmission[];
}

const submissionSchema = new Schema<ISubmission>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['submitted', 'late', 'pending'], default: 'submitted' },
});

const homeworkSchema = new Schema<IHomework>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    batch: { type: String, required: true, trim: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    attachmentUrl: { type: String, trim: true },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

export const Homework = mongoose.models.Homework || mongoose.model<IHomework>('Homework', homeworkSchema);
