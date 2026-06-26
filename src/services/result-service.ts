import { Result } from '@/models/Result';
import { Staff } from '@/models/Staff';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import mongoose from 'mongoose';
import '@/models/Subject';
import '@/models/User';

export async function getStudentResults(userId: string, academicYear?: string) {
  const query: Record<string, unknown> = { student: userId };
  if (academicYear) query.academicYear = academicYear;

  const results = await Result.find(query)
    .populate('results.subject', 'name code')
    .sort({ testDate: -1 })
    .lean();

  return results;
}

export async function enterBulkResults(userId: string, data: {
  academicYear: string;
  term: string;
  testDate: Date;
  subjectId: string;
  maxMarks: number;
  records: Array<{ studentId: string; marksObtained: number; grade?: string }>;
}) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) {
    throw new AppError('Staff profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const { academicYear, term, testDate, subjectId, maxMarks, records } = data;

  const subjectObjId = new mongoose.Types.ObjectId(subjectId);

  // Process each student's marks
  for (const record of records) {
    let resultDoc = await Result.findOne({
      student: record.studentId,
      academicYear,
      term,
    });

    const status = record.marksObtained >= (maxMarks * 0.35) ? 'pass' : 'fail'; // 35% passing criteria

    if (!resultDoc) {
      // Create new document for this term
      resultDoc = new Result({
        student: record.studentId,
        academicYear,
        term,
        testDate,
        results: [{
          subject: subjectObjId,
          marksObtained: record.marksObtained,
          maxMarks,
          grade: record.grade,
          status,
        }],
        totalMarks: maxMarks,
        obtainedMarks: record.marksObtained,
        percentage: (record.marksObtained / maxMarks) * 100,
      });
    } else {
      // Update existing document
      const existingSubjectIndex = resultDoc.results.findIndex(
        (r: { subject: { toString: () => string } }) => r.subject.toString() === subjectId
      );

      if (existingSubjectIndex > -1) {
        // Update subject marks
        resultDoc.results[existingSubjectIndex].marksObtained = record.marksObtained;
        resultDoc.results[existingSubjectIndex].maxMarks = maxMarks;
        resultDoc.results[existingSubjectIndex].grade = record.grade;
        resultDoc.results[existingSubjectIndex].status = status;
      } else {
        // Add new subject marks
        resultDoc.results.push({
          subject: subjectObjId as unknown as mongoose.Types.ObjectId,
          marksObtained: record.marksObtained,
          maxMarks,
          grade: record.grade,
          status,
        });
      }

      // Recalculate totals
      let total = 0;
      let obtained = 0;
      for (const r of resultDoc.results) {
        total += r.maxMarks;
        obtained += r.marksObtained;
      }

      resultDoc.totalMarks = total;
      resultDoc.obtainedMarks = obtained;
      resultDoc.percentage = (obtained / total) * 100;
      resultDoc.testDate = testDate;
    }

    await resultDoc.save();
  }

  return { success: true, count: records.length };
}
