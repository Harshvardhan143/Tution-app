import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { cancelLeave } from '@/services/leave-service';
import { ROLES } from '@/config/constants';

export const DELETE = withApiHandler(async (
  req: NextRequest,
  context
) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  const resolvedParams = await context.params;
  const leaveId = resolvedParams.id as string;
  
  await cancelLeave(user.userId, leaveId);
  
  return successResponse(null, 'Leave cancelled successfully');
});
