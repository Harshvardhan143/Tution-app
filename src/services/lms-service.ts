import { Student } from '@/models/Student';
import { Staff } from '@/models/Staff';
import { LMSMaterial } from '@/models/LMSMaterial';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import { uploadFile } from '@/lib/server/cloudinary';
import '@/models/Subject';
import '@/models/User';

export async function getSubjectsForStudent(userId: string) {
  const student = await Student.findOne({ user: userId })
    .populate('subjects', 'name code description')
    .lean();
    
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return student.subjects;
}

export async function getMaterialsBySubject(
  userId: string, 
  subjectId: string,
  page: number = 1,
  limit: number = 20
) {
  const student = await Student.findOne({ user: userId }).lean();
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const query: Record<string, unknown> = { 
    subject: subjectId, 
    grade: student.grade,
    isActive: true 
  };
  
  // If student has a batch, we filter by that batch.
  // We can also allow materials that have batch set to 'All' if such convention exists.
  if (student.batch) {
    query.batch = { $in: [student.batch, 'All', 'all'] };
  }

  const skip = (page - 1) * limit;

  const [materials, totalCount] = await Promise.all([
    LMSMaterial.find(query)
      .populate('uploadedBy', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LMSMaterial.countDocuments(query)
  ]);

  return {
    materials,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    }
  };
}

export async function uploadMaterial(userId: string, data: {
  subjectId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url?: string;
  fileBuffer?: Buffer;
  grade: string;
  batch: string;
}) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  let finalUrl = data.url;

  if (data.fileBuffer && (data.type === 'pdf' || data.type === 'image' || data.type === 'video')) {
    const uploadResult = await uploadFile(data.fileBuffer, 'eduspark/lms');
    finalUrl = uploadResult.secure_url;
  }

  if (!finalUrl) {
    throw new AppError('Material URL or file is required', HTTP_STATUS.BAD_REQUEST);
  }

  const material = await LMSMaterial.create({
    subject: data.subjectId,
    title: data.title,
    type: data.type,
    url: finalUrl,
    uploadedBy: userId,
    grade: data.grade,
    batch: data.batch,
    isActive: true,
  });

  return material;
}
