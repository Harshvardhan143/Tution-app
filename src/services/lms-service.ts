import { Student } from '@/models/Student';
import { LMSMaterial } from '@/models/LMSMaterial';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
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
