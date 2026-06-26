import { Attendance } from '@/models/Attendance';
import { ATTENDANCE_STATUS } from '@/config/constants';
import '@/models/Subject';

export async function getStudentAttendance(
  userId: string,
  query: { startDate?: string; endDate?: string }
) {
  const filter: Record<string, unknown> = { student: userId };

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) dateFilter.$gte = new Date(query.startDate);
    if (query.endDate) dateFilter.$lte = new Date(query.endDate);
    filter.date = dateFilter;
  }

  const records = await Attendance.find(filter)
    .populate('subject', 'name code')
    .sort({ date: -1, lectureSlot: 1 })
    .lean();

  let presentCount = 0;
  let absentCount = 0;

  for (const r of records) {
    if (r.status === ATTENDANCE_STATUS.PRESENT) {
      presentCount++;
    } else if (r.status === ATTENDANCE_STATUS.ABSENT) {
      absentCount++;
    }
  }

  const totalCalculable = presentCount + absentCount;
  const percentage = totalCalculable > 0 ? (presentCount / totalCalculable) * 100 : 0;

  return {
    records,
    summary: {
      totalCalculable,
      present: presentCount,
      absent: absentCount,
      percentage: Number(percentage.toFixed(2)),
    },
  };
}
