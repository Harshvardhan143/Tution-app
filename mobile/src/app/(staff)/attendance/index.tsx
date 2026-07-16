import { Redirect } from 'expo-router';

export default function AttendanceIndex() {
  // Redirect to the pending attendance screen by default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Redirect href={"/(staff)/attendance/pending" as any} />;
}
