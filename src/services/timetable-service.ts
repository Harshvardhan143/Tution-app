import { Timetable } from '@/models/Timetable';
import { Student } from '@/models/Student';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';
import '@/models/User';

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
