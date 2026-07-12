import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffHomework, createHomework } from '@/services/homework-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';
import { uploadImage } from '@/lib/server/cloudinary';

const createHomeworkSchema = z.object({
  title: z.string(),
  description: z.string(),
  subjectId: z.string(),
  batch: z.string(),
  dueDate: z.string(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  const homeworks = await getStaffHomework(user.userId);
  return successResponse(homeworks, 'Homework fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (await req.formData()) as any;
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const subjectId = formData.get('subjectId') as string;
  const batch = formData.get('batch') as string;
  const dueDateStr = formData.get('dueDate') as string;

  const parsed = createHomeworkSchema.safeParse({ title, description, subjectId, batch, dueDate: dueDateStr });
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const dueDate = new Date(dueDateStr);

  let attachmentUrl: string | undefined;
  
  const attachment = formData.get('attachment');
  if (attachment instanceof File) {
    const arrayBuffer = await attachment.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadImage(buffer);
    attachmentUrl = uploadResult.secure_url;
  }

  const homework = await createHomework(user.userId, {
    title,
    description,
    subjectId,
    batch,
    dueDate,
    attachmentUrl,
  });

  return successResponse(homework, 'Homework created successfully', HTTP_STATUS.CREATED);
});
