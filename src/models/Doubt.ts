import mongoose, { Document, Schema } from 'mongoose';

export interface IDoubt extends Document {
  student: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  question: string;
  attachmentUrl?: string;
  status: 'open' | 'answered';
  answer?: string;
  answeredBy?: mongoose.Types.ObjectId;
  answeredAt?: Date;
}

const doubtSchema = new Schema<IDoubt>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    question: { type: String, required: true, trim: true },
    attachmentUrl: { type: String, trim: true },
    status: { type: String, enum: ['open', 'answered'], default: 'open' },
    answer: { type: String, trim: true },
    answeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

export const Doubt = mongoose.models.Doubt || mongoose.model<IDoubt>('Doubt', doubtSchema);
