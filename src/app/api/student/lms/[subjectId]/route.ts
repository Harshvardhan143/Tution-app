import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getMaterialsBySubject } from '@/services/lms-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (
  req: NextRequest,
  context
) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const resolvedParams = await context.params;
  const subjectId = resolvedParams.subjectId as string;
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  const materials = await getMaterialsBySubject(user.userId, subjectId, page, limit);
  
  return successResponse(materials, 'LMS materials fetched successfully');
});
