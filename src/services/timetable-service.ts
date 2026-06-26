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
