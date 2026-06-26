import { Doubt } from '@/models/Doubt';
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
