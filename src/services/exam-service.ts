import { ExamSchedule } from '@/models/ExamSchedule';
import { Student } from '@/models/Student';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';

export async function getExamSchedules(userId: string) {
  const student = await Student.findOne({ user: userId }).lean();
  
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const query: Record<string, unknown> = { grade: student.grade };
  
  if (student.batch) {
    query.batch = { $in: [student.batch, 'All', 'all'] };
  }

  const schedules = await ExamSchedule.find(query)
    .populate('exams.subject', 'name code')
    .sort({ createdAt: -1 })
    .lean();

  return schedules;
}
