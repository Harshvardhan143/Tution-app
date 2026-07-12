import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffProfile, updateStaffProfile } from '@/services/staff-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF, ROLES.ADMIN]);
  
  const profile = await getStaffProfile(user.userId);
  
  return successResponse(profile, 'Profile fetched successfully');
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF, ROLES.ADMIN]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (await req.formData()) as any;
  
  const name = formData.get('name') as string | null;
  const phone = formData.get('phone') as string | null;
  
  let avatarBuffer: Buffer | undefined;
  const avatar = formData.get('avatar');
  
  if (avatar instanceof File) {
    const arrayBuffer = await avatar.arrayBuffer();
    avatarBuffer = Buffer.from(arrayBuffer);
  }

  const updatedProfile = await updateStaffProfile(user.userId, {
    name: name || undefined,
    phone: phone || undefined,
    avatarBuffer
  });
  
  return successResponse(updatedProfile, 'Profile updated successfully', HTTP_STATUS.OK);
});
