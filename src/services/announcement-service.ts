import { Announcement } from '@/models/Announcement';
import { Student } from '@/models/Student';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/User';

export async function getAnnouncementsForStudent(userId: string) {
  const student = await Student.findOne({ user: userId }).lean();
  
  if (!student) {
    throw new AppError('Student profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const query: Record<string, unknown> = {
    isActive: true,
    targetRole: { $in: ['all', 'student'] },
    $and: [
      { $or: [{ targetGrade: { $exists: false } }, { targetGrade: null }, { targetGrade: '' }, { targetGrade: student.grade }] },
      { $or: [{ targetBatch: { $exists: false } }, { targetBatch: null }, { targetBatch: '' }, { targetBatch: student.batch }] }
    ]
  };

  const announcements = await Announcement.find(query)
    .populate('postedBy', 'name profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  return announcements;
}
