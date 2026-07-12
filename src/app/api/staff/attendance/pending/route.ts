import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getPendingAttendance } from '@/services/attendance-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { AppError } from '@/lib/errors';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');
  
  if (!dateStr) {
    throw new AppError('Date parameter is required', HTTP_STATUS.BAD_REQUEST);
  }

  const pending = await getPendingAttendance(user.userId, dateStr);
  
  return successResponse(pending, 'Pending attendance fetched successfully');
});
