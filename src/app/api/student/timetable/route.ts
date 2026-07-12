import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStudentTimetable } from '@/services/timetable-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const timetable = await getStudentTimetable(user.userId);
  
  return successResponse(timetable, 'Timetable fetched successfully');
});
