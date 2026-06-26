import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getDoubtsForStudent, createDoubt } from '@/services/doubt-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { AppError } from '@/lib/errors';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const doubts = await getDoubtsForStudent(user.userId);
  return successResponse(doubts, 'Doubts fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const formData = await req.formData();
  
  const subjectId = formData.get('subjectId');
  const question = formData.get('question');
  
  if (typeof subjectId !== 'string' || typeof question !== 'string') {
    throw new AppError('subjectId and question are required', HTTP_STATUS.BAD_REQUEST);
  }
  
  let attachmentBuffer: Buffer | undefined;
  
  const attachment = formData.get('attachment');
  if (attachment instanceof File) {
    const arrayBuffer = await attachment.arrayBuffer();
    attachmentBuffer = Buffer.from(arrayBuffer);
  }

  const newDoubt = await createDoubt(user.userId, subjectId, question, attachmentBuffer);
  
  return successResponse(newDoubt, 'Doubt submitted successfully', HTTP_STATUS.CREATED);
});
