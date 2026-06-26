import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getAllPaySlips, generatePaySlip } from '@/services/payslip-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const generatePaySlipSchema = z.object({
  staffId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  basicSalary: z.number().positive(),
  allowances: z.array(z.object({
    name: z.string(),
    amount: z.number().positive()
  })).default([]),
  deductions: z.array(z.object({
    name: z.string(),
    amount: z.number().positive()
  })).default([]),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const monthStr = searchParams.get('month');
  const yearStr = searchParams.get('year');
  
  const month = monthStr ? parseInt(monthStr, 10) : undefined;
  const year = yearStr ? parseInt(yearStr, 10) : undefined;
  
  const payslips = await getAllPaySlips(month, year);
  return successResponse(payslips, 'PaySlips fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = generatePaySlipSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await generatePaySlip(parsed.data);
  return successResponse(result, 'PaySlip generated successfully', HTTP_STATUS.CREATED);
});
