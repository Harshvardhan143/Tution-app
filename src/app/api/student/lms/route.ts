import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getSubjectsForStudent } from '@/services/lms-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const subjects = await getSubjectsForStudent(user.userId);
  
  return successResponse(subjects, 'LMS subjects fetched successfully');
});
