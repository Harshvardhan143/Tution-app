import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { markAttendance } from '@/services/attendance-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const markAttendanceSchema = z.object({
  batch: z.string(),
  date: z.string(),
  subjectId: z.string(),
  lectureSlot: z.number(),
  academicYear: z.string(),
  records: z.array(z.object({
    student: z.string(),
    status: z.enum(['P', 'A', 'PN', '-']),
  }))
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const body = await req.json();
  const parsed = markAttendanceSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await markAttendance(user.userId, parsed.data);
  
  return successResponse(result, 'Attendance marked successfully', HTTP_STATUS.CREATED);
});
