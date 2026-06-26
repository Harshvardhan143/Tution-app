import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { parseExcel } from '@/services/import-service';
import { createStudent } from '@/services/student-service';
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

  const studentsData = await parseExcel<Record<string, string | number | undefined>>(buffer);

  if (!studentsData || studentsData.length === 0) {
    throw new AppError('No data found in the Excel file', HTTP_STATUS.BAD_REQUEST);
  }

  const results = {
    successCount: 0,
    failedCount: 0,
    errors: [] as string[],
  };

  for (const [index, row] of studentsData.entries()) {
    try {
      if (!row.name || !row.email || !row.phone || !row.grade || !row.batch) {
        throw new Error(`Row ${index + 2}: Missing required fields (name, email, phone, grade, batch)`);
      }

      await createStudent({
        name: String(row.name),
        email: String(row.email),
        phone: String(row.phone),
        rollNo: row.rollNo ? String(row.rollNo) : `R${Date.now()}${index}`,
        enrollmentNo: row.enrollmentNo ? String(row.enrollmentNo) : `E${Date.now()}${index}`,
        grade: String(row.grade),
        batch: String(row.batch),
        parentName: row.parentName ? String(row.parentName) : 'Unknown',
        parentPhone: row.parentPhone ? String(row.parentPhone) : String(row.phone),
        academicYear: row.academicYear ? String(row.academicYear) : new Date().getFullYear().toString(),
      });

      results.successCount++;
    } catch (error) {
      results.failedCount++;
      results.errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }

  return successResponse(results, 'Student import process completed');
});
