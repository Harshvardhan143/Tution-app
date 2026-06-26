import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createTimetable, getAllTimetables, updateTimetable, deleteTimetable } from '@/services/timetable-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const slotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  subjectId: z.string(),
  staffId: z.string().optional(),
  room: z.string().optional(),
  type: z.enum(['lecture', 'lab', 'tutorial']),
});

const createTimetableSchema = z.object({
  batch: z.string(),
  grade: z.string(),
  dayOfWeek: z.number().min(0).max(6),
  slots: z.array(slotSchema).min(1),
});

const updateTimetableSchema = z.object({
  timetableId: z.string(),
  batch: z.string().optional(),
  grade: z.string().optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  slots: z.array(slotSchema).optional(),
  isActive: z.boolean().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const timetables = await getAllTimetables();
  return successResponse(timetables, 'Timetables fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createTimetableSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await createTimetable(parsed.data);
  return successResponse(result, 'Timetable created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateTimetableSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { timetableId, ...updateData } = parsed.data;
  const result = await updateTimetable(timetableId, updateData);
  
  return successResponse(result, 'Timetable updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const timetableId = searchParams.get('timetableId');
  
  if (!timetableId) {
    throw new AppError('Timetable ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteTimetable(timetableId);
  return successResponse(result, 'Timetable deactivated successfully');
});
