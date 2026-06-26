import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createStudent, getAllStudents, updateStudent, toggleStudentStatus } from '@/services/student-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createStudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  rollNo: z.string(),
  enrollmentNo: z.string(),
  grade: z.string(),
  batch: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
  academicYear: z.string(),
});

const updateStudentSchema = z.object({
  studentId: z.string(),
  rollNo: z.string().optional(),
  enrollmentNo: z.string().optional(),
  grade: z.string().optional(),
  batch: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  academicYear: z.string().optional(),
  admissionStatus: z.enum(['active', 'inactive', 'graduated']).optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const students = await getAllStudents();
  return successResponse(students, 'Students fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createStudentSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await createStudent(parsed.data);
  return successResponse(result, 'Student created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateStudentSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { studentId, ...updateData } = parsed.data;
  const result = await updateStudent(studentId, updateData);
  
  return successResponse(result, 'Student updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const isActive = searchParams.get('isActive') === 'true';
  
  if (!studentId) {
    throw new AppError('Student ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await toggleStudentStatus(studentId, isActive);
  return successResponse(result, `Student ${isActive ? 'activated' : 'deactivated'} successfully`);
});
