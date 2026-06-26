import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createExamSchedule, getAllExamSchedules, updateExamSchedule, deleteExamSchedule } from '@/services/exam-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const examSchema = z.object({
  subject: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  maxMarks: z.number().positive(),
  passingMarks: z.number().positive(),
  syllabus: z.string().optional(),
});

const createExamScheduleSchema = z.object({
  title: z.string().min(2),
  grade: z.string(),
  batch: z.string().optional(),
  exams: z.array(examSchema).min(1),
});

const updateExamScheduleSchema = z.object({
  scheduleId: z.string(),
  title: z.string().optional(),
  grade: z.string().optional(),
  batch: z.string().optional(),
  exams: z.array(examSchema).optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const schedules = await getAllExamSchedules();
  return successResponse(schedules, 'Exam schedules fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createExamScheduleSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { exams, ...rest } = parsed.data;
  const result = await createExamSchedule({
    ...rest,
    exams: exams.map(e => ({ ...e, date: new Date(e.date) })),
  });
  
  return successResponse(result, 'Exam schedule created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateExamScheduleSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { scheduleId, exams, ...updateData } = parsed.data;
  const result = await updateExamSchedule(scheduleId, {
    ...updateData,
    ...(exams && { exams: exams.map(e => ({ ...e, date: new Date(e.date) })) }),
  });
  
  return successResponse(result, 'Exam schedule updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const scheduleId = searchParams.get('scheduleId');
  
  if (!scheduleId) {
    throw new AppError('Schedule ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteExamSchedule(scheduleId);
  return successResponse(result, 'Exam schedule deleted successfully');
});
