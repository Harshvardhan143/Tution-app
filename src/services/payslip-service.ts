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

export async function getAllPaySlips(month?: number, year?: number) {
  const query: Record<string, unknown> = {};
  if (month) query.month = month;
  if (year) query.year = year;

  return PaySlip.find(query)
    .populate('staff', 'name email profilePicture')
    .sort({ year: -1, month: -1 })
    .lean();
}

export async function generatePaySlip(data: {
  staffId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Array<{ name: string; amount: number }>;
  deductions: Array<{ name: string; amount: number }>;
}) {
  const existingPaySlip = await PaySlip.findOne({
    staff: data.staffId,
    month: data.month,
    year: data.year,
  });

  if (existingPaySlip) {
    throw new AppError('PaySlip already generated for this month and year', HTTP_STATUS.BAD_REQUEST);
  }

  const totalAllowances = data.allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);
  const netSalary = data.basicSalary + totalAllowances - totalDeductions;

  const payslip = await PaySlip.create({
    staff: data.staffId,
    month: data.month,
    year: data.year,
    basicSalary: data.basicSalary,
    allowances: data.allowances,
    deductions: data.deductions,
    netSalary,
    status: 'generated',
    generatedAt: new Date(),
  });

  return payslip;
}
