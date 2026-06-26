import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { parseExcel } from '@/services/import-service';
import { createFeeRecord } from '@/services/fee-service';
import { AppError } from '@/lib/errors';
import { Student } from '@/models/Student';

export const POST = withApiHandler(async (req: NextRequest) => {
  await requireRole(req, [ROLES.ADMIN]);
  
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new AppError('File is required', HTTP_STATUS.BAD_REQUEST);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const feeData = await parseExcel<Record<string, string | number | undefined>>(buffer);

  if (!feeData || feeData.length === 0) {
    throw new AppError('No data found in the Excel file', HTTP_STATUS.BAD_REQUEST);
  }

  const results = {
    successCount: 0,
    failedCount: 0,
    errors: [] as string[],
  };

  for (const [index, row] of feeData.entries()) {
    try {
      if (!row.rollNo || !row.academicYear || !row.amount) {
        throw new Error(`Row ${index + 2}: Missing required fields (rollNo, academicYear, amount)`);
      }

      const student = await Student.findOne({ rollNo: row.rollNo });
      if (!student) {
        throw new Error(`Row ${index + 2}: Student with rollNo ${row.rollNo} not found`);
      }

      // Very simple parsing for the import. Real-world would be more robust.
      await createFeeRecord({
        studentId: student.user.toString(),
        academicYear: String(row.academicYear),
        feeHeads: [{
          name: row.feeHeadName ? String(row.feeHeadName) : 'Tuition Fee',
          amount: Number(row.amount),
          dueDate: new Date(row.dueDate ? String(row.dueDate) : Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days
        }],
      });

      results.successCount++;
    } catch (error) {
      results.failedCount++;
      results.errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }

  return successResponse(results, 'Fee import process completed');
});
