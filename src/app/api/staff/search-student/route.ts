import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { searchStudents } from '@/services/student-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.STAFF, ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const batch = searchParams.get('batch') || undefined;
  const grade = searchParams.get('grade') || undefined;

  const students = await searchStudents({ search, batch, grade });
  
  return successResponse(students, 'Students fetched successfully');
});
