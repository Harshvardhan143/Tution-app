import { Attendance } from '@/models/Attendance';
import { ATTENDANCE_STATUS } from '@/config/constants';
import { Staff } from '@/models/Staff';
import { Timetable } from '@/models/Timetable';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import '@/models/Subject';
import '@/models/User';

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

export async function getPendingAttendance(userId: string, dateStr: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
  
  // Get staff's timetable for today
  const timetables = await Timetable.find({
    'slots.staff': staff._id,
    dayOfWeek,
    isActive: true,
  }).populate('slots.subject', 'name code').lean();

  const pendingSlots: Record<string, unknown>[] = [];

  for (const tt of timetables) {
    const staffSlots = tt.slots.filter(
      (slot: Record<string, unknown>) => slot.staff?.toString() === staff._id.toString()
    );

    for (const slot of staffSlots) {
      // Check if attendance exists for this slot on this date
      const attendanceExists = await Attendance.exists({
        date,
        batch: tt.batch,
        subject: slot.subject._id,
      });

      if (!attendanceExists) {
        pendingSlots.push({
          batch: tt.batch,
          grade: tt.grade,
          date,
          slot,
        });
      }
    }
  }

  return pendingSlots;
}

export async function markAttendance(
  userId: string,
  data: {
    batch: string;
    date: string;
    subjectId: string;
    lectureSlot: number;
    academicYear: string;
    records: Array<{ student: string; status: 'P' | 'A' | 'PN' | '-' }>;
  }
) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  const date = new Date(data.date);
  
  const ops = data.records.map((r) => ({
    updateOne: {
      filter: {
        student: r.student,
        date,
        subject: data.subjectId,
        batch: data.batch,
        lectureSlot: data.lectureSlot,
      },
      update: {
        $set: {
          status: r.status,
          markedBy: staff._id,
          academicYear: data.academicYear,
        },
      },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Attendance.bulkWrite(ops);
  }

  return { success: true, count: ops.length };
}

export async function getAttendanceSummary(userId: string, batch?: string) {
  const staff = await Staff.findOne({ user: userId }).lean();
  if (!staff) throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);

  const filter: Record<string, unknown> = { markedBy: staff._id };
  if (batch) filter.batch = batch;

  // Simple aggregation for staff attendance summary
  const summary = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$batch',
        totalMarked: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ['$status', 'P'] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ['$status', 'A'] }, 1, 0] },
        },
      },
    },
  ]);

  return summary;
}
