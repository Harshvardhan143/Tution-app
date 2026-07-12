import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getAllLeaves, updateLeaveStatus } from '@/services/leave-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const updateLeaveSchema = z.object({
  leaveId: z.string(),
  status: z.enum(['approved', 'rejected']),
  adminRemarks: z.string().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'all';
  
  const leaves = await getAllLeaves(status);
  return successResponse(leaves, 'Leaves fetched successfully');
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateLeaveSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { leaveId, ...updateData } = parsed.data;
  const result = await updateLeaveStatus(leaveId, updateData);
  
  return successResponse(result, `Leave ${updateData.status} successfully`);
});
