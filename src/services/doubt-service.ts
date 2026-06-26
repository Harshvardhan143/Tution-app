import { Doubt } from '@/models/Doubt';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import { uploadImage } from '@/lib/server/cloudinary';
import '@/models/Subject';
import '@/models/User';

export async function getDoubtsForStudent(userId: string) {
  const doubts = await Doubt.find({ student: userId })
    .populate('subject', 'name code')
    .populate('answeredBy', 'name profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  return doubts;
}

export async function createDoubt(
  userId: string,
  subjectId: string,
  question: string,
  attachmentBuffer?: Buffer
) {
  let attachmentUrl = undefined;
  
  if (attachmentBuffer) {
    const uploadResult = await uploadImage(attachmentBuffer, 'eduspark/doubts');
    attachmentUrl = uploadResult.secure_url;
  }
  
  const doubt = await Doubt.create({
    student: userId,
    subject: subjectId,
    question,
    attachmentUrl,
    status: 'open',
  });
  
  return doubt;
}

export async function getStaffDoubts(userId: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  // Get all open doubts for subjects taught by this staff member
  const doubts = await Doubt.find({
    subject: { $in: staff.subjects },
    status: 'open',
  })
    .populate('student', 'name profilePicture')
    .populate('subject', 'name code')
    .sort({ createdAt: -1 })
    .lean();

  return doubts;
}

export async function answerDoubt(
  userId: string,
  doubtId: string,
  answer: string
) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const doubt = await Doubt.findById(doubtId);
  if (!doubt) {
    throw new AppError('Doubt not found', HTTP_STATUS.NOT_FOUND);
  }

  doubt.answer = answer;
  doubt.status = 'answered';
  doubt.answeredBy = staff._id;
  doubt.answeredAt = new Date();

  await doubt.save();
  return doubt;
}
