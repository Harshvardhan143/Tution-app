import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffTimetable } from '@/services/timetable-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const timetables = await getStaffTimetable(user.userId);
  
  return successResponse(timetables, 'Timetable fetched successfully');
});
