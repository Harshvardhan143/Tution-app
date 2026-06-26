import { User } from '@/models/User';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { uploadImage } from '@/lib/server/cloudinary';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';

export async function getStaffProfile(userId: string) {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const staff = await Staff.findOne({ user: userId })
    .populate('subjects', 'name code')
    .lean();
    
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return {
    ...user,
    staffDetails: staff,
  };
}

export async function updateStaffProfile(
  userId: string, 
  data: {
    name?: string;
    phone?: string;
    avatarBuffer?: Buffer;
  }
) {
  const updateData: Record<string, unknown> = {};
  
  if (data.name) updateData.name = data.name;
  if (data.phone) updateData.phone = data.phone;
  
  if (data.avatarBuffer) {
    const uploadResult = await uploadImage(data.avatarBuffer);
    updateData.profilePicture = uploadResult.secure_url;
  }

  if (Object.keys(updateData).length > 0) {
    await User.findByIdAndUpdate(userId, { $set: updateData });
  }

  return getStaffProfile(userId);
}
