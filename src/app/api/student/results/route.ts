import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStudentResults } from '@/services/result-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const { searchParams } = new URL(req.url);
  const academicYear = searchParams.get('academicYear') || undefined;
  
  const results = await getStudentResults(user.userId, academicYear);
  
  return successResponse(results, 'Results fetched successfully');
});
