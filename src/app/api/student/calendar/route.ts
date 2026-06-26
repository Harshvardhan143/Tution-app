import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getEventsForStudent } from '@/services/calendar-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.STUDENT]);
  
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  
  const events = await getEventsForStudent({ startDate, endDate });
  
  return successResponse(events, 'Calendar events fetched successfully');
});
