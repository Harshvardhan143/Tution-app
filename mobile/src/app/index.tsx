import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === 'student') {
    return <Redirect href="/(student)/dashboard" />;
  } else if (role === 'staff') {
    return <Redirect href="/(staff)/dashboard" />;
  }

  // Fallback
  return <Redirect href="/(auth)/login" />;
}
