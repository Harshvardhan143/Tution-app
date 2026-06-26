import { Result } from '@/models/Result';
import '@/models/Subject';

export async function getStudentResults(userId: string, academicYear?: string) {
  const query: Record<string, unknown> = { student: userId };
  if (academicYear) query.academicYear = academicYear;

  const results = await Result.find(query)
    .populate('results.subject', 'name code')
    .sort({ testDate: -1 })
    .lean();

  return results;
}
