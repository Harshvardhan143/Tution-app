import { Leave } from '@/models/Leave';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/User';

export async function getStaffLeaves(userId: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  return Leave.find({ staff: userId }).sort({ createdAt: -1 }).lean();
}

export async function applyLeave(userId: string, data: {
  leaveType: 'casual' | 'sick' | 'earned';
  fromDate: string;
  toDate: string;
  isHalfDay: boolean;
  reason?: string;
}) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  const start = new Date(data.fromDate);
  const end = new Date(data.toDate);
  
  if (start > end) {
    throw new AppError('fromDate must be before toDate', HTTP_STATUS.BAD_REQUEST);
  }

  // Calculate days (simple difference + 1, assuming consecutive days)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  let totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (data.isHalfDay) {
    totalDays = 0.5;
  }

  const leave = await Leave.create({
    staff: userId, // The schema says staff: User ObjectId
    leaveType: data.leaveType,
    fromDate: start,
    toDate: end,
    isHalfDay: data.isHalfDay,
    reason: data.reason,
    totalDays,
  });

  return leave;
}

export async function cancelLeave(userId: string, leaveId: string) {
  const leave = await Leave.findById(leaveId);
  
  if (!leave) {
    throw new AppError('Leave request not found', HTTP_STATUS.NOT_FOUND);
  }

  if (leave.staff.toString() !== userId) {
    throw new AppError('Unauthorized to cancel this leave', HTTP_STATUS.FORBIDDEN);
  }

  if (leave.status !== 'pending') {
    throw new AppError('Only pending leave requests can be cancelled', HTTP_STATUS.BAD_REQUEST);
  }

  await leave.deleteOne();
  return { success: true };
}
