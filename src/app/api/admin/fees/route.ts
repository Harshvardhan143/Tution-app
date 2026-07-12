import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createFeeRecord, getAllFees, markFeePayment } from '@/services/fee-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createFeeSchema = z.object({
  studentId: z.string(),
  academicYear: z.string(),
  feeHeads: z.array(z.object({
    name: z.string(),
    amount: z.number().positive(),
    dueDate: z.string(),
  })).min(1),
});

const markPaymentSchema = z.object({
  feeId: z.string(),
  amount: z.number().positive(),
  paymentMode: z.enum(['cash', 'upi', 'bank_transfer', 'cheque']),
  paymentRef: z.string().optional(),
  feeHeadsPaid: z.array(z.object({
    name: z.string(),
    amount: z.number().positive(),
  })).min(1),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const fees = await getAllFees();
  return successResponse(fees, 'Fees fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createFeeSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { studentId, academicYear, feeHeads } = parsed.data;
  const result = await createFeeRecord({
    studentId,
    academicYear,
    feeHeads: feeHeads.map(h => ({ ...h, dueDate: new Date(h.dueDate) })),
  });
  
  return successResponse(result, 'Fee record created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = markPaymentSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { feeId, ...paymentData } = parsed.data;
  const result = await markFeePayment(feeId, paymentData);
  
  return successResponse(result, 'Fee payment marked successfully');
});
