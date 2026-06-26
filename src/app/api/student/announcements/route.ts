import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getAnnouncementsForStudent } from '@/services/announcement-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const announcements = await getAnnouncementsForStudent(user.userId);
  
  return successResponse(announcements, 'Announcements fetched successfully');
});
