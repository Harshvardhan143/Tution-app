import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffPaySlips } from '@/services/payslip-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const payslips = await getStaffPaySlips(user.userId);
  
  return successResponse(payslips, 'Pay slips fetched successfully');
});
