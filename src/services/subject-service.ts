import { Subject } from '@/models/Subject';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';

export async function getAllSubjects() {
  return Subject.find()
    .sort({ name: 1 })
    .lean();
}

export async function createSubject(data: {
  name: string;
  code: string;
  grade: string;
  description?: string;
}) {
  const existingSubject = await Subject.findOne({ code: data.code });
  if (existingSubject) {
    throw new AppError('Subject code already exists', HTTP_STATUS.BAD_REQUEST);
  }

  const subject = await Subject.create({
    ...data,
    isActive: true,
  });

  return subject;
}

export async function updateSubject(subjectId: string, data: Record<string, unknown>) {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['name', 'code', 'grade', 'description', 'isActive'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (subject as Record<string, unknown>)[field] = data[field];
    }
  }

  await subject.save();
  return subject;
}

export async function deleteSubject(subjectId: string) {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new AppError('Subject not found', HTTP_STATUS.NOT_FOUND);
  }

  subject.isActive = false;
  await subject.save();

  return subject;
}
