import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { parseExcel } from '@/services/import-service';
import { createStaff } from '@/services/staff-service';
import { AppError } from '@/lib/errors';

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new AppError('File is required', HTTP_STATUS.BAD_REQUEST);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const staffData = await parseExcel<Record<string, string | number | undefined>>(buffer);

  if (!staffData || staffData.length === 0) {
    throw new AppError('No data found in the Excel file', HTTP_STATUS.BAD_REQUEST);
  }

  const results = {
    successCount: 0,
    failedCount: 0,
    errors: [] as string[],
  };

  for (const [index, row] of staffData.entries()) {
    try {
      if (!row.name || !row.email || !row.phone || !row.qualification || !row.salary) {
        throw new Error(`Row ${index + 2}: Missing required fields (name, email, phone, qualification, salary)`);
      }

      await createStaff({
        name: String(row.name),
        email: String(row.email),
        phone: String(row.phone),
        employeeCode: row.employeeCode ? String(row.employeeCode) : `EMP${Date.now()}${index}`,
        qualification: String(row.qualification),
        salary: Number(row.salary),
        batches: row.batches ? String(row.batches).split(',').map((b: string) => b.trim()) : [],
      });

      results.successCount++;
    } catch (error) {
      results.failedCount++;
      results.errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }

  return successResponse(results, 'Staff import process completed');
});
