import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getAttendanceSummary } from '@/services/attendance-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const { searchParams } = new URL(req.url);
  const batch = searchParams.get('batch') || undefined;

  const summary = await getAttendanceSummary(user.userId, batch);
  
  return successResponse(summary, 'Attendance summary fetched successfully');
});
