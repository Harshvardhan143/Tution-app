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

export async function searchStudents(query: { search?: string; batch?: string; grade?: string }) {
  const filter: Record<string, unknown> = {};

  if (query.batch) filter.batch = query.batch;
  if (query.grade) filter.grade = query.grade;

  let userFilter: Record<string, unknown> | null = null;
  if (query.search) {
    userFilter = { name: { $regex: query.search, $options: 'i' } };
  }

  // If there's a name search, first find matching users
  let userIds: string[] = [];
  if (userFilter) {
    const matchingUsers = await User.find(userFilter).select('_id').lean();
    userIds = matchingUsers.map(u => u._id.toString());
    
    // If we searched by name but found no users, return empty early
    if (userIds.length === 0) return [];
    
    filter.user = { $in: userIds };
  }

  const students = await Student.find(filter)
    .populate('user', 'name email phone profilePicture')
    .sort({ 'user.name': 1 })
    .limit(50)
    .lean();

  return students;
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
