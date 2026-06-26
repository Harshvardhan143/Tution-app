import { Homework } from '@/models/Homework';
import { Student } from '@/models/Student';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import mongoose from 'mongoose';
import { Staff } from '@/models/Staff';
import '@/models/Subject';
import '@/models/User';

export async function getHomeworkForStudent(userId: string) {
  const student = await Student.findOne({ user: userId }).lean();
  
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const query: Record<string, unknown> = {};
  if (student.batch) {
    query.batch = { $in: [student.batch, 'All', 'all'] };
  }

  const homeworks = await Homework.find(query)
    .populate('subject', 'name code')
    .populate('assignedBy', 'name profilePicture')
    .sort({ dueDate: -1 })
    .lean();

  return homeworks;
}

export async function markHomeworkSubmitted(homeworkId: string, userId: string) {
  const homework = await Homework.findById(homeworkId);
  if (!homework) {
    throw new AppError('Homework not found', HTTP_STATUS.NOT_FOUND);
  }

  const studentIdObj = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const status = now > homework.dueDate ? 'late' : 'submitted';

  const existingSubmissionIndex = homework.submissions.findIndex(
    (s: { student: { toString: () => string } }) => s.student.toString() === userId
  );

  if (existingSubmissionIndex > -1) {
    homework.submissions[existingSubmissionIndex].submittedAt = now;
    homework.submissions[existingSubmissionIndex].status = status;
  } else {
    homework.submissions.push({
      student: studentIdObj,
      submittedAt: now,
      status,
    });
  }

  await homework.save();

  return homework;
}

export async function getStaffHomework(userId: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const homeworks = await Homework.find({ assignedBy: userId })
    .populate('subject', 'name code')
    .sort({ dueDate: -1 })
    .lean();

  return homeworks;
}

export async function createHomework(userId: string, data: {
  title: string;
  description: string;
  subjectId: string;
  batch: string;
  dueDate: Date;
  attachmentUrl?: string;
}) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const homework = await Homework.create({
    title: data.title,
    description: data.description,
    subject: data.subjectId,
    batch: data.batch,
    assignedBy: userId,
    dueDate: data.dueDate,
    attachmentUrl: data.attachmentUrl,
  });

  return homework;
}
