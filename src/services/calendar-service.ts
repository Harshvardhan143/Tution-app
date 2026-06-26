import { AcademicCalendar } from '@/models/AcademicCalendar';

export async function getEventsForStudent(dateRange?: { startDate?: string; endDate?: string }) {
  const query: Record<string, unknown> = { targetRole: { $in: ['all', 'student'] } };

  if (dateRange?.startDate || dateRange?.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (dateRange.startDate) dateFilter.$gte = new Date(dateRange.startDate);
    if (dateRange.endDate) dateFilter.$lte = new Date(dateRange.endDate);
    query.fromDate = dateFilter;
  }

  const events = await AcademicCalendar.find(query)
    .sort({ fromDate: 1 })
    .lean();

  return events;
}
