import { Timetable } from '@/models/Timetable';
import { Student } from '@/models/Student';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';
import '@/models/User';

export async function getStaffTimetable(userId: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  // Find all timetables that have this staff member assigned to at least one slot
  const timetables = await Timetable.find({
    'slots.staff': staff._id,
    isActive: true,
  })
    .populate('slots.subject', 'name code')
    .sort({ dayOfWeek: 1 })
    .lean();

  // Filter slots to only include the ones assigned to this staff member
  const filteredTimetables = timetables.map(tt => ({
    ...tt,
    slots: tt.slots.filter(
      (slot: Record<string, unknown>) => slot.staff?.toString() === staff._id.toString()
    )
  })).filter(tt => tt.slots.length > 0);

  return filteredTimetables;
}

export async function getStudentTimetable(userId: string) {
  const student = await Student.findOne({ user: userId }).lean();
  
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }
  
  if (!student.batch || !student.grade) {
    return []; // No timetable if batch or grade is not assigned
  }

  const timetables = await Timetable.find({
    batch: student.batch,
    grade: student.grade,
    isActive: true,
  })
    .populate('slots.subject', 'name code')
    .populate('slots.staff', 'name profilePicture')
    .sort({ dayOfWeek: 1 })
    .lean();

  return timetables;
}

export async function getAllTimetables() {
  return Timetable.find()
    .populate('slots.subject', 'name code')
    .populate('slots.staff', 'name profilePicture')
    .sort({ grade: 1, batch: 1, dayOfWeek: 1 })
    .lean();
}

export async function createTimetable(data: {
  batch: string;
  grade: string;
  dayOfWeek: number;
  slots: Array<{
    startTime: string;
    endTime: string;
    subjectId: string;
    staffId?: string;
    room?: string;
    type: 'lecture' | 'lab' | 'tutorial';
  }>;
}) {
  const existing = await Timetable.findOne({
    batch: data.batch,
    dayOfWeek: data.dayOfWeek,
  });

  if (existing) {
    throw new AppError('Timetable already exists for this batch on this day', HTTP_STATUS.BAD_REQUEST);
  }

  const timetable = await Timetable.create({
    ...data,
    slots: data.slots.map(s => ({
      ...s,
      subject: s.subjectId,
      staff: s.staffId,
    })),
    isActive: true,
  });

  return timetable;
}

export async function updateTimetable(timetableId: string, data: Record<string, unknown>) {
  const timetable = await Timetable.findById(timetableId);
  if (!timetable) {
    throw new AppError('Timetable not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['batch', 'grade', 'dayOfWeek', 'slots', 'isActive'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      if (field === 'slots') {
        const slotsData = data[field] as Array<{ subjectId?: string; subject?: string; staffId?: string; staff?: string; [key: string]: unknown }>;
        timetable.slots = slotsData.map(s => ({
          ...s,
          subject: s.subjectId || s.subject,
          staff: s.staffId || s.staff,
        })) as unknown as typeof timetable.slots;
      } else {
        (timetable as Record<string, unknown>)[field] = data[field];
      }
    }
  }

  await timetable.save();
  return timetable;
}

export async function deleteTimetable(timetableId: string) {
  const timetable = await Timetable.findById(timetableId);
  if (!timetable) {
    throw new AppError('Timetable not found', HTTP_STATUS.NOT_FOUND);
  }

  timetable.isActive = false;
  await timetable.save();

  return timetable;
}
