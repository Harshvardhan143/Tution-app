import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffLeaves, applyLeave } from '@/services/leave-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const applyLeaveSchema = z.object({
  leaveType: z.enum(['casual', 'sick', 'earned']),
  fromDate: z.string(),
  toDate: z.string(),
  isHalfDay: z.boolean().default(false),
  reason: z.string().optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const leaves = await getStaffLeaves(user.userId);
  
  return successResponse(leaves, 'Leave requests fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const body = await req.json();
  const parsed = applyLeaveSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const leave = await applyLeave(user.userId, parsed.data);
  
  return successResponse(leave, 'Leave applied successfully', HTTP_STATUS.CREATED);
});
