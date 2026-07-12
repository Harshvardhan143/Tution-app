import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getProfile, updateProfile } from '@/services/student-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const profile = await getProfile(user.userId);
  return successResponse(profile, 'Student profile fetched successfully');
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (await req.formData()) as any;
  
  const data: { phone?: string; address?: string } = {};
  
  const phone = formData.get('phone');
  if (typeof phone === 'string') data.phone = phone;
  
  const address = formData.get('address');
  if (typeof address === 'string') data.address = address;
  
  let avatarBuffer: Buffer | undefined;
  
  const profilePicture = formData.get('profilePicture');
  if (profilePicture instanceof File) {
    const arrayBuffer = await profilePicture.arrayBuffer();
    avatarBuffer = Buffer.from(arrayBuffer);
  }

  const updatedProfile = await updateProfile(user.userId, data, avatarBuffer);
  return successResponse(updatedProfile, 'Student profile updated successfully');
});
