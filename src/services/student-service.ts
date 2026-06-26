import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { AppError } from '@/lib/errors';
import { uploadImage } from '@/lib/server/cloudinary';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';

export async function getProfile(userId: string) {
  const user = await User.findById(userId).lean();
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const student = await Student.findOne({ user: userId })
    .populate('subjects', 'name code')
    .lean();

  if (!student) throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);

  return {
    ...user,
    studentDetails: student,
  };
}

export async function updateProfile(
  userId: string,
  data: { phone?: string; address?: string },
  avatarBuffer?: Buffer
) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const student = await Student.findOne({ user: userId });
  if (!student) throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);

  if (data.phone !== undefined) {
    user.phone = data.phone;
  }

  if (avatarBuffer) {
    const uploadResult = await uploadImage(avatarBuffer, 'eduspark/profiles');
    user.profilePicture = uploadResult.secure_url;
  }

  if (data.address !== undefined) {
    student.address = data.address;
  }

  await user.save();
  await student.save();

  return getProfile(userId);
}
