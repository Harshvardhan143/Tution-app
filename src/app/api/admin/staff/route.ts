import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { createStaff, getAllStaff, updateStaff, toggleStaffStatus } from '@/services/staff-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  employeeCode: z.string(),
  qualification: z.string(),
  salary: z.number().positive(),
  batches: z.array(z.string()),
});

const updateStaffSchema = z.object({
  staffId: z.string(),
  employeeCode: z.string().optional(),
  qualification: z.string().optional(),
  salary: z.number().positive().optional(),
  batches: z.array(z.string()).optional(),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  const staff = await getAllStaff();
  return successResponse(staff, 'Staff fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = createStaffSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await createStaff(parsed.data);
  return successResponse(result, 'Staff created successfully', HTTP_STATUS.CREATED);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const body = await req.json();
  const parsed = updateStaffSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const { staffId, ...updateData } = parsed.data;
  const result = await updateStaff(staffId, updateData);
  
  return successResponse(result, 'Staff updated successfully');
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get('staffId');
  const isActive = searchParams.get('isActive') === 'true';
  
  if (!staffId) {
    throw new AppError('Staff ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await toggleStaffStatus(staffId, isActive);
  return successResponse(result, `Staff ${isActive ? 'activated' : 'deactivated'} successfully`);
});
