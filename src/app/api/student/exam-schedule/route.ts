import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getExamSchedules } from '@/services/exam-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const schedules = await getExamSchedules(user.userId);
  
  return successResponse(schedules, 'Exam schedules fetched successfully');
});
