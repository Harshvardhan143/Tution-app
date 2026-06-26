import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { uploadMaterial } from '@/services/lms-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const uploadMaterialSchema = z.object({
  subjectId: z.string(),
  title: z.string(),
  type: z.enum(['pdf', 'video', 'link', 'image']),
  url: z.string().optional(),
  grade: z.string(),
  batch: z.string(),
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF, ROLES.ADMIN]);
  
  const formData = await req.formData();
  
  const subjectId = formData.get('subjectId') as string;
  const title = formData.get('title') as string;
  const type = formData.get('type') as 'pdf' | 'video' | 'link' | 'image';
  const url = formData.get('url') as string | undefined;
  const grade = formData.get('grade') as string;
  const batch = formData.get('batch') as string;

  const parsed = uploadMaterialSchema.safeParse({ subjectId, title, type, url, grade, batch });
  if (!parsed.success) {
    throw new AppError('Invalid request data: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  let fileBuffer: Buffer | undefined;
  const file = formData.get('file');
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuffer);
  }

  const material = await uploadMaterial(user.userId, {
    subjectId,
    title,
    type,
    url: url || undefined,
    fileBuffer,
    grade,
    batch,
  });

  return successResponse(material, 'Material uploaded successfully', HTTP_STATUS.CREATED);
});
