import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { parseExcel } from '@/services/import-service';
import { enterBulkResults } from '@/services/result-service';
import { AppError } from '@/lib/errors';
import { Student } from '@/models/Student';
import { Subject } from '@/models/Subject';

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.ADMIN]);
  
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new AppError('File is required', HTTP_STATUS.BAD_REQUEST);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const resultsData = await parseExcel<Record<string, string | number | undefined>>(buffer);

  if (!resultsData || resultsData.length === 0) {
    throw new AppError('No data found in the Excel file', HTTP_STATUS.BAD_REQUEST);
  }

  // We will group records by academicYear, term, and subject to call enterBulkResults
  const groups: Record<string, {
    academicYear: string;
    term: string;
    testDate: Date;
    subjectId: string;
    maxMarks: number;
    records: Array<{ studentId: string; marksObtained: number; grade?: string }>;
  }> = {};

  const errorLog: string[] = [];
  let parsedCount = 0;

  for (const [index, row] of resultsData.entries()) {
    try {
      if (!row.rollNo || !row.academicYear || !row.term || !row.subjectCode || !row.marksObtained || !row.maxMarks) {
        throw new Error(`Row ${index + 2}: Missing required fields (rollNo, academicYear, term, subjectCode, marksObtained, maxMarks)`);
      }

      const student = await Student.findOne({ rollNo: row.rollNo });
      if (!student) {
        throw new Error(`Row ${index + 2}: Student with rollNo ${row.rollNo} not found`);
      }

      const subject = await Subject.findOne({ code: row.subjectCode });
      if (!subject) {
        throw new Error(`Row ${index + 2}: Subject with code ${row.subjectCode} not found`);
      }

      const groupKey = `${row.academicYear}_${row.term}_${subject._id}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          academicYear: String(row.academicYear),
          term: String(row.term),
          testDate: new Date(row.testDate ? String(row.testDate) : Date.now()),
          subjectId: subject._id.toString(),
          maxMarks: Number(row.maxMarks),
          records: [],
        };
      }

      groups[groupKey].records.push({
        studentId: student.user.toString(),
        marksObtained: Number(row.marksObtained),
        grade: row.grade ? String(row.grade) : undefined,
      });

      parsedCount++;
    } catch (error) {
      errorLog.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }

  const importStats = {
    successGroups: 0,
    failedGroups: 0,
    parsedRecords: parsedCount,
    errors: errorLog,
  };

  // Execute grouped bulk updates
  for (const group of Object.values(groups)) {
    try {
      await enterBulkResults(user.userId, group);
      importStats.successGroups++;
    } catch (error) {
      importStats.failedGroups++;
      importStats.errors.push(`Failed to import group for Subject ID ${group.subjectId}: ${(error as Error).message}`);
    }
  }

  return successResponse(importStats, 'Results import process completed');
});
