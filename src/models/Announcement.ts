import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  targetRole: 'all' | 'student' | 'staff';
  targetBatch?: string;
  targetGrade?: string;
  isImportant: boolean;
  postedBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    targetRole: { type: String, enum: ['all', 'student', 'staff'], default: 'all' },
    targetBatch: { type: String, trim: true },
    targetGrade: { type: String, trim: true },
    isImportant: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', announcementSchema);
