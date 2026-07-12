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

export async function getAllExamSchedules() {
  return ExamSchedule.find()
    .populate('exams.subject', 'name code')
    .sort({ createdAt: -1 })
    .lean();
}

export async function createExamSchedule(data: {
  title: string;
  grade: string;
  batch?: string;
  exams: Array<{
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    maxMarks: number;
    passingMarks: number;
    syllabus?: string;
  }>;
}) {
  const schedule = await ExamSchedule.create(data);
  return schedule;
}

export async function updateExamSchedule(scheduleId: string, data: Record<string, unknown>) {
  const schedule = await ExamSchedule.findById(scheduleId);
  if (!schedule) {
    throw new AppError('Exam schedule not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['title', 'grade', 'batch', 'exams'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (schedule as Record<string, unknown>)[field] = data[field];
    }
  }

  await schedule.save();
  return schedule;
}

export async function deleteExamSchedule(scheduleId: string) {
  const schedule = await ExamSchedule.findByIdAndDelete(scheduleId);
  if (!schedule) {
    throw new AppError('Exam schedule not found', HTTP_STATUS.NOT_FOUND);
  }

  return schedule;
}
