import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getAllResults, enterBulkResults } from '@/services/result-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const enterBulkResultsSchema = z.object({
  academicYear: z.string(),
  term: z.string(),
  testDate: z.string(),
  subjectId: z.string(),
  maxMarks: z.number().positive(),
  records: z.array(z.object({
    studentId: z.string(),
    marksObtained: z.number().min(0),
    grade: z.string().optional(),
  })).min(1)
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const results = await getAllResults();
  return successResponse(results, 'Results fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = enterBulkResultsSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { testDate, ...rest } = parsed.data;

  // We pass user.userId as the actor (staff/admin) entering the result
  const result = await enterBulkResults(user.userId, {
    ...rest,
    testDate: new Date(testDate),
  });
  
  return successResponse(result, 'Results entered successfully', HTTP_STATUS.CREATED);
});
