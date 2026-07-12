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

export async function getAllAnnouncements() {
  return Announcement.find()
    .populate('postedBy', 'name profilePicture')
    .sort({ createdAt: -1 })
    .lean();
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  type: string;
  priority: string;
  targetRole: string;
  targetGrade?: string;
  targetBatch?: string;
  expiresAt?: Date;
  postedBy: string;
}) {
  const announcement = await Announcement.create({
    ...data,
    isActive: true,
  });

  return announcement;
}

export async function updateAnnouncement(announcementId: string, data: Record<string, unknown>) {
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new AppError('Announcement not found', HTTP_STATUS.NOT_FOUND);
  }

  const updatableFields = ['title', 'content', 'type', 'priority', 'targetRole', 'targetGrade', 'targetBatch', 'expiresAt', 'isActive'];
  
  for (const field of updatableFields) {
    if (data[field] !== undefined) {
      (announcement as Record<string, unknown>)[field] = data[field];
    }
  }

  await announcement.save();
  return announcement;
}

export async function deleteAnnouncement(announcementId: string) {
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new AppError('Announcement not found', HTTP_STATUS.NOT_FOUND);
  }

  announcement.isActive = false;
  await announcement.save();

  return announcement;
}
