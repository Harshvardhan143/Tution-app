import { PaySlip } from '@/models/PaySlip';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/User';

export async function getStaffPaySlips(userId: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  return PaySlip.find({ staff: userId }).sort({ year: -1, month: -1 }).lean();
}
