import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createAnnouncement, getAllAnnouncements, updateAnnouncement, deleteAnnouncement } from '@/services/announcement-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createAnnouncementSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  type: z.enum(['general', 'exam', 'holiday', 'event', 'urgent']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  targetRole: z.enum(['all', 'student', 'staff', 'parent']),
  targetGrade: z.string().optional(),
  targetBatch: z.string().optional(),
  expiresAt: z.string().optional(),
});

const updateAnnouncementSchema = z.object({
  announcementId: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  type: z.enum(['general', 'exam', 'holiday', 'event', 'urgent']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  targetRole: z.enum(['all', 'student', 'staff', 'parent']).optional(),
  targetGrade: z.string().optional(),
  targetBatch: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const announcements = await getAllAnnouncements();
  return successResponse(announcements, 'Announcements fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createAnnouncementSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { expiresAt, ...rest } = parsed.data;
  const result = await createAnnouncement({
    ...rest,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    postedBy: user.userId,
  });
  
  return successResponse(result, 'Announcement created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateAnnouncementSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { announcementId, expiresAt, ...updateData } = parsed.data;
  const result = await updateAnnouncement(announcementId, {
    ...updateData,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });
  
  return successResponse(result, 'Announcement updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const announcementId = searchParams.get('announcementId');
  
  if (!announcementId) {
    throw new AppError('Announcement ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await deleteAnnouncement(announcementId);
  return successResponse(result, 'Announcement deactivated successfully');
});
