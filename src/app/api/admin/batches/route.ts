import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createBatch, getAllBatches, updateBatch, deleteBatch } from '@/services/batch-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createBatchSchema = z.object({
  name: z.string().min(2),
  grade: z.string(),
  timing: z.string(),
  days: z.array(z.string()).min(1),
  maxStudents: z.number().positive(),
  students: z.array(z.string()).optional(),
  staff: z.array(z.string()).optional(),
});

const updateBatchSchema = z.object({
  batchId: z.string(),
  name: z.string().optional(),
  grade: z.string().optional(),
  timing: z.string().optional(),
  days: z.array(z.string()).optional(),
  maxStudents: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  students: z.array(z.string()).optional(),
  staff: z.array(z.string()).optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const batches = await getAllBatches();
  return successResponse(batches, 'Batches fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createBatchSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await createBatch(parsed.data);
  return successResponse(result, 'Batch created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateBatchSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { batchId, ...updateData } = parsed.data;
  const result = await updateBatch(batchId, updateData);
  
  return successResponse(result, 'Batch updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId');
  
  if (!batchId) {
    throw new AppError('Batch ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteBatch(batchId);
  return successResponse(result, 'Batch deactivated successfully');
});
