import { Batch } from '@/models/Batch';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Student';
import '@/models/Staff';

export async function getAllBatches() {
  return Batch.find()
    .populate('students', 'rollNo')
    .populate('staff', 'employeeCode')
    .sort({ name: 1 })
    .lean();
}

export async function createBatch(data: {
  name: string;
  grade: string;
  timing: string;
  days: string[];
  maxStudents: number;
  students?: string[];
  staff?: string[];
}) {
  const existingBatch = await Batch.findOne({ name: data.name });
  if (existingBatch) {
    throw new AppError('Batch name already exists', HTTP_STATUS.BAD_REQUEST);
  }

  const batch = await Batch.create({
    ...data,
    isActive: true,
  });

  return batch;
}

export async function updateBatch(batchId: string, data: Record<string, unknown>) {
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new AppError('Batch not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['name', 'grade', 'timing', 'days', 'maxStudents', 'isActive', 'students', 'staff'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (batch as Record<string, unknown>)[field] = data[field];
    }
  }

  await batch.save();
  return batch;
}

export async function deleteBatch(batchId: string) {
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new AppError('Batch not found', HTTP_STATUS.NOT_FOUND);
  }

  batch.isActive = false;
  await batch.save();

  return batch;
}
