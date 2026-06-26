import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
// Using a mock auth state for UI dev since authStore might not be ready
// In real app: import { useAuthStore } from '@/store/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  
  // Mock auth state for branch 9
  const isAuthenticated = true;
  const isLoading = false;

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from login if authenticated
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return null; // Or a full screen loader
  }

  return <>{children}</>;
}
