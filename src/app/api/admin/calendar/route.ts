import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '@/services/calendar-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['holiday', 'exam', 'event', 'term_start', 'term_end']),
  fromDate: z.string(),
  toDate: z.string().optional(),
  targetRole: z.enum(['all', 'student', 'staff']).optional(),
  targetGrade: z.string().optional(),
  targetBatch: z.string().optional(),
});

const updateEventSchema = z.object({
  eventId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['holiday', 'exam', 'event', 'term_start', 'term_end']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  targetRole: z.enum(['all', 'student', 'staff']).optional(),
  targetGrade: z.string().optional(),
  targetBatch: z.string().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const events = await getAllEvents();
  return successResponse(events, 'Calendar events fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { fromDate, toDate, ...rest } = parsed.data;
  const result = await createEvent({
    ...rest,
    fromDate: new Date(fromDate),
    toDate: toDate ? new Date(toDate) : undefined,
  });
  
  return successResponse(result, 'Calendar event created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateEventSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { eventId, fromDate, toDate, ...updateData } = parsed.data;
  const result = await updateEvent(eventId, {
    ...updateData,
    ...(fromDate && { fromDate: new Date(fromDate) }),
    ...(toDate && { toDate: new Date(toDate) }),
  });
  
  return successResponse(result, 'Calendar event updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  
  if (!eventId) {
    throw new AppError('Event ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteEvent(eventId);
  return successResponse(result, 'Calendar event deleted successfully');
});
