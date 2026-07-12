import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { getCurrentUser } from '@/lib/server/auth';
import { User } from '@/models';

async function meHandler(req: NextRequest) {
  const payload = await getCurrentUser(req);
  
  const user = await User.findById(payload.userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return successResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    requirePasswordChange: user.requirePasswordChange,
  }, 'User profile retrieved', 200);
}

export const GET = withApiHandler(meHandler);
