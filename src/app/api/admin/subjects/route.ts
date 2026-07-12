import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createSubject, getAllSubjects, updateSubject, deleteSubject } from '@/services/subject-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createSubjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  grade: z.string(),
  description: z.string().optional(),
});

const updateSubjectSchema = z.object({
  subjectId: z.string(),
  name: z.string().optional(),
  code: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const subjects = await getAllSubjects();
  return successResponse(subjects, 'Subjects fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createSubjectSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await createSubject(parsed.data);
  return successResponse(result, 'Subject created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateSubjectSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { subjectId, ...updateData } = parsed.data;
  const result = await updateSubject(subjectId, updateData);
  
  return successResponse(result, 'Subject updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  
  if (!subjectId) {
    throw new AppError('Subject ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteSubject(subjectId);
  return successResponse(result, 'Subject deactivated successfully');
});
