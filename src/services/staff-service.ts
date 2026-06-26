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

export async function getAllStaff() {
  return Staff.find()
    .populate('user', 'name email phone isActive')
    .sort({ 'user.name': 1 })
    .lean();
}

export async function createStaff(data: {
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  qualification: string;
  salary: number;
  batches: string[];
}) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('Email already exists', HTTP_STATUS.BAD_REQUEST);
  }

  // Create User
  const user = new User({
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'staff',
    isActive: true,
  });

  // Hash a default password
  await user.setPassword('Staff@123'); // Default password
  await user.save();

  // Create Staff
  const staff = await Staff.create({
    user: user._id,
    employeeCode: data.employeeCode,
    qualification: data.qualification,
    salary: data.salary,
    batches: data.batches,
    joiningDate: new Date(),
  });

  return { user, staff };
}

export async function updateStaff(staffId: string, data: Record<string, unknown>) {
  const staff = await Staff.findById(staffId);
  if (!staff) {
    throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['employeeCode', 'qualification', 'salary', 'batches'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (staff as Record<string, unknown>)[field] = data[field];
    }
  }

  await staff.save();
  return staff;
}

export async function toggleStaffStatus(staffId: string, isActive: boolean) {
  const staff = await Staff.findById(staffId);
  if (!staff) {
    throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
  }

  const user = await User.findById(staff.user);
  if (user) {
    user.isActive = isActive;
    await user.save();
  }

  return { staff, user };
}
