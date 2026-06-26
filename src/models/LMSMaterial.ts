import mongoose, { Document, Schema } from 'mongoose';

export interface ILMSMaterial extends Document {
  subject: mongoose.Types.ObjectId;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string; // Cloudinary URL or YouTube link
  uploadedBy: mongoose.Types.ObjectId;
  grade: string;
  batch: string;
  isActive: boolean;
  createdAt: Date;
}

const lmsMaterialSchema = new Schema<ILMSMaterial>(
  {
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['pdf', 'video', 'link', 'image'], required: true },
    url: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LMSMaterial = mongoose.models.LMSMaterial || mongoose.model<ILMSMaterial>('LMSMaterial', lmsMaterialSchema);
