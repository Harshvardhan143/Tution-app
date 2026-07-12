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

export async function getAllEvents() {
  return AcademicCalendar.find()
    .sort({ fromDate: 1 })
    .lean();
}

export async function createEvent(data: {
  title: string;
  description?: string;
  type: string;
  fromDate: Date;
  toDate?: Date;
  targetRole?: string;
  targetGrade?: string;
  targetBatch?: string;
}) {
  const event = await AcademicCalendar.create(data);
  return event;
}

export async function updateEvent(eventId: string, data: Record<string, unknown>) {
  const event = await AcademicCalendar.findByIdAndUpdate(
    eventId,
    { $set: data },
    { new: true }
  );

  if (!event) {
    throw new Error('Event not found');
  }

  return event;
}

export async function deleteEvent(eventId: string) {
  const event = await AcademicCalendar.findByIdAndDelete(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }

  return event;
}
