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

export async function getAllStudents() {
  return Student.find()
    .populate('user', 'name email phone isActive')
    .sort({ 'user.name': 1 })
    .lean();
}

export async function createStudent(data: {
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  enrollmentNo: string;
  grade: string;
  batch: string;
  parentName: string;
  parentPhone: string;
  academicYear: string;
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
    role: 'student',
    isActive: true,
  });

  // Hash a default password
  await user.setPassword('Password@123'); // Default password
  await user.save();

  // Create Student
  const student = await Student.create({
    user: user._id,
    rollNo: data.rollNo,
    enrollmentNo: data.enrollmentNo,
    grade: data.grade,
    batch: data.batch,
    parentName: data.parentName,
    parentPhone: data.parentPhone,
    academicYear: data.academicYear,
    admissionDate: new Date(),
    admissionStatus: 'active',
  });

  return { user, student };
}

export async function updateStudent(studentId: string, data: Record<string, unknown>) {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['rollNo', 'enrollmentNo', 'grade', 'batch', 'parentName', 'parentPhone', 'academicYear', 'admissionStatus'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (student as Record<string, unknown>)[field] = data[field];
    }
  }

  await student.save();
  return student;
}

export async function toggleStudentStatus(studentId: string, isActive: boolean) {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  const user = await User.findById(student.user);
  if (user) {
    user.isActive = isActive;
    await user.save();
  }

  student.admissionStatus = isActive ? 'active' : 'inactive';
  await student.save();

  return { student, user };
}
