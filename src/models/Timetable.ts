import mongoose, { Document, Schema } from 'mongoose';

export interface ITimetableSlot {
  startTime: string;
  endTime: string;
  subject: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  room?: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface ITimetable extends Document {
  batch: string;
  grade: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  slots: ITimetableSlot[];
  effectiveFrom?: Date;
  effectiveTo?: Date;
  isActive: boolean;
}

const timetableSlotSchema = new Schema<ITimetableSlot>({
  startTime: { type: String, required: true, trim: true },
  endTime: { type: String, required: true, trim: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String, trim: true },
  type: { type: String, enum: ['lecture', 'lab', 'tutorial'], default: 'lecture' },
});

const timetableSchema = new Schema<ITimetable>(
  {
    batch: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: [timetableSlotSchema],
    effectiveFrom: { type: Date },
    effectiveTo: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Timetable = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', timetableSchema);
