import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getHomeworkForStudent, markHomeworkSubmitted } from '@/services/homework-service';
import { ROLES } from '@/config/constants';
import { z } from 'zod';

const patchSchema = z.object({
  homeworkId: z.string({ message: 'homeworkId is required' }),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  const homeworks = await getHomeworkForStudent(user.userId);
  
  return successResponse(homeworks, 'Homework fetched successfully');
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const body = await req.json();
  const { homeworkId } = patchSchema.parse(body);
  
  const updatedHomework = await markHomeworkSubmitted(homeworkId, user.userId);
  
  return successResponse(updatedHomework, 'Homework marked as submitted');
});
